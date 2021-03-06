import * as React from 'react';
import classes, { createScopedClasses } from '../utils/classnames';
import scrollbarWidth from './scrollbar-width';
import './style';
import { UIEventHandler, useEffect, useRef, useState, TouchEventHandler } from 'react';
import { Icon } from '../index';

const componentName = 'Scroll';
const sc = createScopedClasses(componentName);

export interface Props extends StyledProps {
  onPullUp?: () => void
  onPullDown?: () => void
  pullingHeight?: number
}

const Scroll: React.FC<Props> = props => {
  const [barHeight, setBarHeight] = useState(0);
  const [barTop, _setBarTop] = useState(0);
  const [barVisible, setBarVisible] = useState(false);
  const {children, className, pullingHeight, onPullUp, onPullDown, ...rest} = props;

  const timeIdRef = useRef<number | null>(null);
  const scrollHeight = () => containerRef.current!.scrollHeight;
  const viewHeight = () => containerRef.current!.getBoundingClientRect().height;
  const scrollTop = () => containerRef.current!.scrollTop;
  const setBarTop = (top: number) => {
    if (top < 0) {return;}
    const maxBarTop = (scrollHeight() - viewHeight()) * viewHeight() / scrollHeight();
    if (top > maxBarTop) {return;}
    _setBarTop(top);
  };
  const onScroll: UIEventHandler = () => {
    setBarTop(scrollTop() * viewHeight() / scrollHeight());
    setBarVisible(true);
    if (timeIdRef.current) {clearTimeout(timeIdRef.current);}
    timeIdRef.current = window.setTimeout(() => {
      setBarVisible(false);
    }, 300);
  };
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setBarHeight(viewHeight() * viewHeight() / scrollHeight());
  }, []);

  const firstBarTopRef = useRef(0);
  const firstRef = useRef(0);
  const draggingRef = useRef(false);
  const onMouseDownBar = (e: MouseEvent) => {
    draggingRef.current = true;
    firstRef.current = e.clientY;
    firstBarTopRef.current = barTop;
  };
  const onMouseMoveBar = (e: MouseEvent) => {
    if (draggingRef.current) {
      const delta = e.clientY - firstRef.current;
      const newBarTop = firstBarTopRef.current + delta;
      setBarTop(newBarTop); // 可能存在滚动条拖动和内容滚动更新不一致的问题
      containerRef.current!.scrollTop = scrollHeight() * newBarTop / viewHeight();
    }
  };
  const onMouseUpBar = () => {
    draggingRef.current = false;
  };
  const onSelect = (e: Event) => {
    if (draggingRef.current) {e.preventDefault();}
  };
  useEffect(() => {
    document.addEventListener('mouseup', onMouseUpBar);
    document.addEventListener('mousemove', onMouseMoveBar);
    document.addEventListener('selectstart', onSelect);
    return () => {
      document.removeEventListener('mouseup', onMouseUpBar);
      document.removeEventListener('mousemove', onMouseMoveBar);
      document.removeEventListener('selectstart', onSelect);
    };
  }, []);

  const [translateY, _setTranslateY] = useState(0);

  const setTranslateY = (y: number) => {
    const {pullingHeight} = props;
    if (pullDownRef.current) {
      if (y < 0) {y = 0;}
      if (y > pullingHeight!) {y = pullingHeight!;}
    }
    if (pullUpRef.current) {
      if (y >= 0) {y = 0;}
      if (y < -(pullingHeight!)) {y = -(pullingHeight!);}
    }
    _setTranslateY(y);
  };

  const lastYRef = useRef(0);
  const moveCountRef = useRef(0);
  const pullDownRef = useRef<boolean>(false);
  const pullUpRef = useRef<boolean>(false);

  const onTouchStart: TouchEventHandler = (e) => {
    if (e.touches.length > 1) {return; }
    const maxScrollHeight = scrollHeight();
    const height = viewHeight();
    if (scrollTop() === 0) { pullDownRef.current = true;}
    if (scrollTop() + height === maxScrollHeight && height !== maxScrollHeight) { pullUpRef.current = true;}

    lastYRef.current = e.touches[0].clientY;
    moveCountRef.current = 0;
  };
  const onTouchMove: TouchEventHandler = (e) => {
    const deltaY = e.touches[0].clientY - lastYRef.current;
    moveCountRef.current += 1;
    // 上拉
    if (moveCountRef.current === 1 && deltaY < 0 && pullUpRef.current) {}
    // 下拉
    if (moveCountRef.current === 1 && deltaY > 0 && pullDownRef.current) {}
    if (pullDownRef.current || pullUpRef.current) {
      setTranslateY(translateY + deltaY);
    }
    lastYRef.current = e.touches[0].clientY;
  };
  const onToucheEnd: TouchEventHandler = () => {
    if (pullDownRef.current) {
      pullDownRef.current = false;
      setTranslateY(0);
      onPullDown && onPullDown();
    }
    if (pullUpRef.current) {
      pullUpRef.current = false;
      setTranslateY(0);
      onPullUp && onPullUp();
    }
  };
  return (
    <div className={classes(sc('wrapper'), props.className)} {...rest}>
      {pullDownRef.current &&
      <div className={sc('pulling-down')} style={{height: translateY}}>
        <Icon name={translateY === props.pullingHeight ? 'top' : 'bottom'}/>
        <span className={sc('pulling-text')}>{translateY === props.pullingHeight ? '释放手指即可更新' : ''}</span>
      </div>
      }
      <div className={sc('inner')} style={{right: -scrollbarWidth(), transform: `translateY(${translateY}px)`}}
           ref={containerRef} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onToucheEnd}
           onScroll={onScroll}>{children}</div>

      {pullUpRef.current &&
      <div className={sc('pulling-up')} style={{height: Math.abs(translateY)}}>
        <Icon name="loading"/><span
        className={sc('pulling-text')}>{translateY === -(props.pullingHeight!) ? '释放手指即可加载更多' : ''}</span>
      </div>
      }
      <div className={sc('track')}>
        {barVisible &&
        <div className={sc('bar')} style={{height: barHeight, transform: `translateY(${barTop}px)`}}
             onMouseDown={() => onMouseDownBar}></div>
        }
      </div>
    </div>
  );
};
Scroll.displayName = componentName;
Scroll.defaultProps = {
  pullingHeight: 100
};
export default Scroll;

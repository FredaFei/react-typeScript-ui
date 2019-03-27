import * as React from 'react'
import * as PropTypes from 'prop-types'
import { classNames } from '../utils'
import './style'

type TabsProps = {
  activeKey?: string
  defaultActiveKey?: string
  direction?: string
  className?: string
  style?: React.CSSProperties
  onChange?: (key: string) => any
}
type TabsState = {
  defaultKey: string
}
type TabPaneProps = {
  tab?: string
  key?: string
  active?: boolean
  className?: string
  style?: React.CSSProperties
}
const componentName = 'Tabs'
class Tabs extends React.Component<TabsProps, TabsState> {
  public static defaultProps = {
    direction: 'horizontal'
  }
  public static propTypes = {
    activeKey: PropTypes.string,
    defaultActiveKey: PropTypes.string,
    direction: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
  }
  private lineElement: React.RefObject<HTMLDivElement>
  private tabsHeadElement: React.RefObject<HTMLDivElement>
  private navItemElement: React.RefObject<HTMLDivElement>
  constructor(props: TabsProps) {
    super(props)
    this.lineElement = React.createRef()
    this.tabsHeadElement = React.createRef()
    this.navItemElement = React.createRef()
    this.state = {
      defaultKey: props.activeKey || ''
    }
  }
  private keys: string[] = []
  public static getDerivedStateFromProps(
    nextProps: TabsProps,
    prevState: TabsState
  ) {
    if (
      'activeKey' in nextProps &&
      nextProps.activeKey !== prevState.defaultKey
    ) {
      return { defaultKey: nextProps.activeKey }
    }
    return null
  }
  componentDidMount() {
    if (!('defaultActiveKey' in this.props) && !('activeKey' in this.props)) {
      this.setState({
        defaultKey: this.keys[0]
      })
    } else {
      console.log(this.navItemElement)
      const index: number = this.keys.indexOf(this.state.defaultKey) || 0
      const navItemElement = this.tabsHeadElement.current.children[index]
      this.calculateLineStyle(navItemElement)
    }
  }
  public componentDidUpdate(prevProps: TabsProps, prevState: TabsState) {
    if (this.state.defaultKey !== prevState.defaultKey) {
      const index: number = this.keys.indexOf(this.state.defaultKey) || 0
      const navItemElement = this.tabsHeadElement.current.children[index]
      this.calculateLineStyle(navItemElement)
    }
  }
  public calculateLineStyle(el) {
    const { direction } = this.props
    const lineElement = this.lineElement.current
    const tabsHeadElement = this.tabsHeadElement.current
    let { left: left1, top: top1 } = tabsHeadElement.getBoundingClientRect()
    let { width, left: left2, height, top: top2 } = el.getBoundingClientRect()
    if (direction === 'horizontal') {
      lineElement.style.width = `${width}px`
      lineElement.style.left = `${left2 - left1}px`
    } else {
      lineElement.style.height = `${height}px`
      lineElement.style.top = `${top2 - top1}px`
    }
  }

  public handleClick = (key: string, e: React.MouseEvent): any => {
    this.setState({
      defaultKey: key
    })
    const index: number = this.keys.indexOf(key) || 0
    const navItemElement = this.tabsHeadElement.current.children[index]
    this.calculateLineStyle(navItemElement)
    const { onChange } = this.props
    onChange && onChange(key)
  }
  public renderTabsNav = (): React.ReactNode[] => {
    const { children } = this.props
    const { defaultKey } = this.state
    return React.Children.map(
      children,
      (child: React.ReactElement<TabPaneProps>) => {
        if (!child) {
          return null
        }
        const key = child.key as string
        this.keys.push(key)
        const active = defaultKey === key
        return (
          <div
            data-role="tabsNavItem"
            className={classNames('', ['am-tabs-nav-item'], { active })}
            onClick={(e: React.MouseEvent) => this.handleClick(key, e)}
            ref={this.navItemElement}
          >
            {child.props.tab}
          </div>
        )
      }
    )
  }
  public renderTabsPane = (): React.ReactNode[] => {
    const { children } = this.props
    const { defaultKey } = this.state
    return React.Children.map(
      children,
      (child: React.ReactElement<TabPaneProps>) => {
        if (!child) {
          return null
        }
        const key = child.key as string
        this.keys.push(key)
        const active = defaultKey === key
        return React.cloneElement(child as React.ReactElement<TabPaneProps>, {
          active
        })
      }
    )
  }
  renderTabs = () => {
    const { className, style, children, ...rest } = this.props
    const styles = Object.assign({}, { ...style })
    const tabsClasses = classNames(componentName, 'wrapper', [className])
    return (
      <div data-role="tabs" className={tabsClasses} style={styles} {...rest}>
        <div className="am-tabs-nav" ref={this.tabsHeadElement}>
          {this.renderTabsNav()}
          <div className="line" ref={this.lineElement} />
        </div>
        <ul className="am-tabs-pane-body">{this.renderTabsPane()}</ul>
      </div>
    )
  }
  render() {
    return this.renderTabs()
  }
}
export default Tabs
import * as React from 'react';
import Tree, { SourceItem } from '../packages/tree/tree';

import content1 from './markdown/tree-demo-1.md';
import CodeBox from './codeBox';
import Markdown from './markdown';
import doc from './markdown/tree-doc.md';
import { useState } from 'react';

export default function (props: any) {
  const [data] = useState<SourceItem[]>([
    {
      text: '1',
      value: '1',
      children: [
        {
          text: '1.1',
          value: '1.1',
          children: [
            {
              text: '1.1.1',
              value: '1.1.1',
            },
            {
              text: '1.1.2',
              value: '1.1.2',
            }
          ]
        }, {
          text: '1.2',
          value: '1.2',
        },
      ],
    }, {
      text: '2',
      value: '2',
      children: [
        {
          text: '2.1',
          value: '2.1',
        }, {
          text: '2.2',
          value: '2.2',
        }
      ],
    }
  ]);
  const [selected, setSelected] = useState(['1.1']);
  const [selectedValues, setSelectedValues] = useState(['1.1.1','2.1']);
  const onChange1 = (item: SourceItem, checked: boolean) => {
    if (checked) {
      setSelected([item.value]);
    } else {
      setSelected([]);
    }
  };
  const onChange2 = (item: SourceItem, checked: boolean) => {
    if (checked) {
      setSelectedValues([...selectedValues, item.value]);
    } else {
      setSelectedValues(selectedValues.filter(i => i !== item.value));
    }
  };
  return (
    <div className="exp-box">
      <h3>基础应用</h3>
      <div className="exp-section">
        <p>多选</p>
        <p>selectedValues: {selectedValues}</p>
        <Tree sourceData={data} selected={selectedValues} onChange={onChange2}/>
        <CodeBox content={content1}/>
      </div>
      <div className="exp-section">
        <p>单选</p>
        <p>selected: {selected}</p>
        <Tree sourceData={data} selected={selected} onChange={onChange1} multiple={false}/>
        <CodeBox content={content1}/>
      </div>
      <Markdown source={doc}/>
    </div>
  );
}
import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { Inspector } from '../src';

storiesOf('DOM Node', module)
  // ELEMENT_NODE
  .add('Element Node: body', () => <Inspector data={document.body} />)
  .add('Element Node: div', () => <Inspector data={document.createElement('div')} />)
  .add('Element Node: div with data attributes', () => {
    const div = document.createElement('div');
    div.setAttribute('data-test', 'test');
    // div.dataset
    return <Inspector data={div} />;
  })
  .add('Element Node: div with class and style', () => {
    const div = document.createElement('div');
    div.setAttribute('class', 'test');
    div.setAttribute('style', 'font-weight: bold;');
    return <Inspector data={div} />;
  })
  .add('Element Node: div with children', () => {
    const div = document.createElement('div');
    const span = document.createElement('span');
    span.textContent = 'hello';
    div.appendChild(span);
    return <Inspector data={div} />;
  })
  // COMMENT_NODE
  .add('Comment Node', () => <Inspector data={document.createComment('this is a comment')} />)
  // TEXT_NODE
  .add('Text Node', () => <Inspector data={document.createTextNode('this is a text node')} />)
  // PROCESSING_INSTRUCTION_NODE
  .add('Processing Instruction Node', () => {
    var docu = new DOMParser().parseFromString('<xml></xml>', 'application/xml');
    var pi = docu.createProcessingInstruction('xml-stylesheet', 'href="mycss.css" type="text/css"');
    return <Inspector data={pi} />;
  })
  // DOCUMENT_TYPE_NODE
  .add('Document Type Node', () => {
    return <Inspector data={document.childNodes[0]} />;
  })
  // DOCUMENT_NODE
  .add('Document Node', () => <Inspector expandLevel={2} data={document} />)
  // DOCUMENT_FRAGMENT_NODE
  // https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
  // x-tags http://blog.vjeux.com/2013/javascript/custom-components-react-x-tags.html
  .add('Document Fragment Node', () => <Inspector data={document.createElement('template').content} />)
  // 带有 activeNode 的示例
  .add('With Active Node', () => {
    // 创建一个包含多个子节点的 div 元素
    const createDivWithChildren = () => {
      const div = document.createElement('div');
      div.setAttribute('id', 'root');

      const header = document.createElement('header');
      header.textContent = '标题';
      div.appendChild(header);

      const main = document.createElement('main');
      const p1 = document.createElement('p');
      p1.textContent = '第一段落';
      const p2 = document.createElement('p');
      p2.textContent = '第二段落';
      main.appendChild(p1);
      main.appendChild(p2);
      div.appendChild(main);

      const footer = document.createElement('footer');
      footer.textContent = '页脚';
      div.appendChild(footer);

      return div;
    };

    // 使用 React 的 useState 钩子来跟踪当前选中的节点
    const ActiveNodeExample = () => {
      const [divWithChildren] = useState(createDivWithChildren());
      const [activeNode, setActiveNode] = useState(null);
      const [activeNodeInfo, setActiveNodeInfo] = useState('未选择节点');

      // 当节点被选中时更新状态
      const handleNodeSelect = (node) => {
        setActiveNode(node);
        setActiveNodeInfo(
          node
            ? `选中的节点: ${node.nodeName}${node.id ? `#${node.id}` : ''} (${
                (node.childNodes && node.childNodes.length) || 0
              } 个子节点)`
            : '未选择节点'
        );
      };

      return (
        <div>
          <div style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            {activeNodeInfo}
          </div>
          <Inspector data={divWithChildren} expandLevel={2} activeNode={activeNode} onNodeSelect={handleNodeSelect} />
        </div>
      );
    };

    return <ActiveNodeExample />;
  });

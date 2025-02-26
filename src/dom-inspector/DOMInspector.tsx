import React, { FC, useCallback } from 'react';

import { DOMNodePreview } from './DOMNodePreview';
import { TreeView } from '../tree-view/TreeView';

import { shouldInline } from './shouldInline';
import { themeAcceptor } from '../styles';

const domIterator = function* (data: any) {
  if (data && data.childNodes) {
    const textInlined = shouldInline(data);

    if (textInlined) {
      return;
    }

    for (let i = 0; i < data.childNodes.length; i++) {
      const node = data.childNodes[i];

      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length === 0) continue;

      yield {
        name: `${node.tagName}[${i}]`,
        data: node,
      };
    }

    // at least 1 child node
    if (data.tagName) {
      yield {
        name: 'CLOSE_TAG',
        data: {
          tagName: data.tagName,
        },
        isCloseTag: true,
      };
    }
  }
};

interface DOMInspectorProps {
  data: any;
  activeNode?: any;
  onNodeSelect?: (node: any) => void;
  [key: string]: any;
}

const DOMInspector: FC<DOMInspectorProps> = (props) => {
  const { activeNode, onNodeSelect, ...restProps } = props;

  // 创建一个自定义的节点渲染器，用于检查节点是否是活动节点
  const nodeRenderer = useCallback(
    (nodeProps: any) => {
      // 检查当前节点是否是活动节点
      const isActive =
        activeNode &&
        // 对于普通节点，直接比较
        ((nodeProps.isCloseTag === undefined && nodeProps.data === activeNode) ||
          // 对于关闭标签，检查其父节点是否是活动节点
          (nodeProps.isCloseTag && nodeProps.data.tagName === activeNode.tagName));

      // 确保 isActive 属性传递给 DOMNodePreview
      return <DOMNodePreview {...nodeProps} isActive={isActive} />;
    },
    [activeNode]
  );

  // 创建一个自定义的点击处理函数，用于通知父组件节点被选中
  const handleNodeSelect = useCallback(
    (node: any) => {
      if (onNodeSelect && node && !node.isCloseTag) {
        onNodeSelect(node);
      }
    },
    [onNodeSelect]
  );

  return (
    <TreeView
      nodeRenderer={nodeRenderer}
      dataIterator={domIterator}
      onNodeSelect={handleNodeSelect}
      activeNode={activeNode}
      {...restProps}
    />
  );
};

// DOMInspector.propTypes = {
//   // The DOM Node to inspect
//   data: PropTypes.object.isRequired,
// };

const themedDOMInspector = themeAcceptor(DOMInspector);

export { themedDOMInspector as DOMInspector };

import React, { useContext, useCallback, useLayoutEffect, useState, memo } from 'react';
import { ExpandedPathsContext } from './ExpandedPathsContext';
import { TreeNode } from './TreeNode';
import { DEFAULT_ROOT_PATH, hasChildNodes, getExpandedPaths } from './pathUtils';

import { useStyles } from '../styles';

const ConnectedTreeNode = memo<any>((props) => {
  const { data, dataIterator, path, depth, nodeRenderer, onNodeSelect, selectedNode, setSelectedNode } = props;
  const [expandedPaths, setExpandedPaths] = useContext(ExpandedPathsContext);
  const nodeHasChildNodes = hasChildNodes(data, dataIterator);
  const expanded = !!expandedPaths[path];
  const isActive = selectedNode === data;

  const handleClick = useCallback(
    (e) => {
      // 更新选中的节点
      setSelectedNode(data);

      // 调用外部的节点选择回调
      if (onNodeSelect) {
        onNodeSelect(data);
      }

      // 处理节点展开/折叠
      if (nodeHasChildNodes) {
        setExpandedPaths((prevExpandedPaths) => ({
          ...prevExpandedPaths,
          [path]: !expanded,
        }));
      }
    },
    [nodeHasChildNodes, setExpandedPaths, path, expanded, onNodeSelect, data, setSelectedNode]
  );

  return (
    <TreeNode
      expanded={expanded}
      onClick={handleClick}
      // show arrow anyway even if not expanded and not rendering children
      shouldShowArrow={nodeHasChildNodes}
      // show placeholder only for non root nodes
      shouldShowPlaceholder={depth > 0}
      // 传递 isActive 属性
      isActive={isActive}
      // Render a node from name and data (or possibly other props like isNonenumerable)
      nodeRenderer={nodeRenderer}
      {...props}>
      {
        // only render if the node is expanded
        expanded
          ? [...dataIterator(data)].map(({ name, data, ...renderNodeProps }) => {
              return (
                <ConnectedTreeNode
                  name={name}
                  data={data}
                  depth={depth + 1}
                  path={`${path}.${name}`}
                  key={name}
                  dataIterator={dataIterator}
                  nodeRenderer={nodeRenderer}
                  onNodeSelect={onNodeSelect}
                  selectedNode={selectedNode}
                  setSelectedNode={setSelectedNode}
                  {...renderNodeProps}
                />
              );
            })
          : null
      }
    </TreeNode>
  );
});

// ConnectedTreeNode.propTypes = {
//   name: PropTypes.string,
//   data: PropTypes.any,
//   dataIterator: PropTypes.func,
//   depth: PropTypes.number,
//   expanded: PropTypes.bool,
//   nodeRenderer: PropTypes.func,
//   onNodeSelect: PropTypes.func,
// };

export const TreeView = memo<any>(
  ({ name, data, dataIterator, nodeRenderer, expandPaths, expandLevel, onNodeSelect, activeNode }) => {
    const styles = useStyles('TreeView');
    const stateAndSetter = useState({});
    const [, setExpandedPaths] = stateAndSetter;

    // 添加内部状态来跟踪选中的节点
    const [selectedNode, setSelectedNode] = useState(activeNode || null);

    // 当外部的 activeNode 属性变化时，更新内部状态
    useLayoutEffect(() => {
      if (activeNode !== undefined) {
        setSelectedNode(activeNode);
      }
    }, [activeNode]);

    useLayoutEffect(
      () =>
        setExpandedPaths((prevExpandedPaths) =>
          getExpandedPaths(data, dataIterator, expandPaths, expandLevel, prevExpandedPaths)
        ),
      [data, dataIterator, expandPaths, expandLevel]
    );

    return (
      <ExpandedPathsContext.Provider value={stateAndSetter}>
        <ol role="tree" style={styles.treeViewOutline}>
          <ConnectedTreeNode
            name={name}
            data={data}
            dataIterator={dataIterator}
            depth={0}
            path={DEFAULT_ROOT_PATH}
            nodeRenderer={nodeRenderer}
            onNodeSelect={onNodeSelect}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
          />
        </ol>
      </ExpandedPathsContext.Provider>
    );
  }
);

// TreeView.propTypes = {
//   name: PropTypes.string,
//   data: PropTypes.any,
//   dataIterator: PropTypes.func,
//   nodeRenderer: PropTypes.func,
//   expandPaths: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
//   expandLevel: PropTypes.number,
//   onNodeSelect: PropTypes.func,
// };

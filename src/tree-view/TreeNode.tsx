/* eslint-disable @typescript-eslint/no-empty-function */
import React, { Children, FC, memo, useState } from 'react';
import { useStyles } from '../styles';

const Arrow: FC<any> = ({ expanded, styles }) => (
  <span
    style={{
      ...styles.base,
      ...(expanded ? styles.expanded : styles.collapsed),
    }}>
    ▶
  </span>
);

export const TreeNode: FC<any> = memo((props) => {
  props = {
    expanded: true,
    nodeRenderer: ({ name }: any) => <span>{name}</span>,
    onClick: () => {},
    shouldShowArrow: false,
    shouldShowPlaceholder: true,
    isActive: false,
    ...props,
  };
  const { expanded, onClick, children, nodeRenderer, title, shouldShowArrow, shouldShowPlaceholder, isActive } = props;

  const [isHovered, setIsHovered] = useState(false);
  const styles = useStyles('TreeNode');
  const NodeRenderer = nodeRenderer;

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // 获取当前节点的背景颜色
  const getBackgroundColor = () => {
    if (isActive && styles.treeNodeActive) {
      return styles.treeNodeActive.backgroundColor;
    }
    if (isHovered && styles.treeNodeHover) {
      return styles.treeNodeHover.backgroundColor;
    }
    return styles.treeNodeBase.backgroundColor;
  };

  // 基本节点样式，移除背景色（将由行容器提供）
  const nodeStyle = {
    ...styles.treeNodeBase,
    backgroundColor: 'transparent', // 移除背景色，由行容器提供
    margin: 0,
    padding: 0,
  };

  // 整行容器样式 - 这是我们应用背景色的地方
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor: getBackgroundColor(),
    padding: '2px 0',
    cursor: 'pointer',
  };

  // 内容容器样式
  const contentStyle = {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  };

  // 子节点容器样式
  const childContainerStyle = {
    ...styles.treeNodeChildNodesContainer,
    backgroundColor: 'transparent', // 确保子节点容器不影响背景色
  };

  // 确保 isActive 属性传递给 NodeRenderer
  const nodeRendererProps = {
    ...props,
    isActive, // 显式传递 isActive 属性
  };

  return (
    <li aria-expanded={expanded} role="treeitem" style={nodeStyle} title={title}>
      {/* 整行容器 - 应用背景色到整行 */}
      <div style={rowStyle} onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {/* 箭头或占位符 */}
        {shouldShowArrow || Children.count(children) > 0 ? (
          <Arrow expanded={expanded} styles={styles.treeNodeArrow} />
        ) : (
          shouldShowPlaceholder && <span style={styles.treeNodePlaceholder}>&nbsp;</span>
        )}
        {/* 节点内容 */}
        <div style={contentStyle}>
          <NodeRenderer {...nodeRendererProps} />
        </div>
      </div>

      {/* 子节点容器 */}
      <ol role="group" style={childContainerStyle}>
        {expanded ? children : undefined}
      </ol>
    </li>
  );
});

// TreeNode.propTypes = {
//   name: PropTypes.string,
//   data: PropTypes.any,
//   expanded: PropTypes.bool,
//   shouldShowArrow: PropTypes.bool,
//   shouldShowPlaceholder: PropTypes.bool,
//   nodeRenderer: PropTypes.func,
//   onClick: PropTypes.func,
//   isActive: PropTypes.bool,
// };

function computePairLayout({ width, height, gutter }) {
  return {
    totalWidth: width + gutter + width,
    totalHeight: height,
    leftPosition: { left: 0, top: 0 },
    rightPosition: { left: width + gutter, top: 0 },
  };
}

function computeTriptychLayout({ panelWidth, panelHeight, targetWidth }) {
  const totalWidth = panelWidth * 3;
  const totalHeight = panelHeight;
  const result = {
    totalWidth,
    totalHeight,
    positions: [
      { left: 0, top: 0 },
      { left: panelWidth, top: 0 },
      { left: panelWidth * 2, top: 0 },
    ],
  };
  if (typeof targetWidth === 'number') {
    result.targetWidth = targetWidth;
    result.targetHeight = Math.round(totalHeight * (targetWidth / totalWidth));
  }
  return result;
}

module.exports = { computePairLayout, computeTriptychLayout };

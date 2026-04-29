function computePairLayout({ width, height, gutter }) {
  return {
    totalWidth: width + gutter + width,
    totalHeight: height,
    leftPosition: { left: 0, top: 0 },
    rightPosition: { left: width + gutter, top: 0 },
  };
}

function computeTriptychLayout({ panelWidth, panelHeight, targetWidth }) {
  // Add 1px padding to avoid libvips "same dimensions or smaller" rejection
  // when a panel's right edge exactly meets the canvas right edge.
  const totalWidth = panelWidth * 3 + 1;
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

import { filter } from '../utils/utils.js';

export const generateFilters = (points) => Object.entries(filter).map(([filterType, filterPatternByType]) => ({
  type: filterType,
  count: filterPatternByType(points).length
}));

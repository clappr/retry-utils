/**
 * Deslocate the interval of percentage in a random range with the limit of x%
 * 
 * @param {number} percentage 
 */
const randomIntervalPercentage = (percentage) => {
  if (!percentage || Number.isNaN(percentage)) return 1
  
  return Math.random() + percentage
}

export default randomIntervalPercentage
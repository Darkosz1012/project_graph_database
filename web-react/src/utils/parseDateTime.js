export default function (date) {
  var arr = date.split('T')
  return `${arr[0]} ${arr[1].split('.')[0]}`
}

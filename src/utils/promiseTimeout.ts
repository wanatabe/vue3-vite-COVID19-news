/**
 * 异步超时函数
 * @param fn 异步方法
 * @param time 超时时间
 * @returns
 */
export default function promiseTimeout<T>(fn: Promise<T>, time: number): Promise<T> {
  let timer: NodeJS.Timeout
  return Promise.race([
    fn,
    new Promise(function (resolve, reject) {
      timer = setTimeout(function () {
        reject(new Error('异步响应超时！ '))
      }, time)
    })
  ]).then(
    function (res) {
      clearTimeout(timer)
      return res
    },
    function (reject) {
      clearTimeout(timer)
      return reject
    }
  )
}

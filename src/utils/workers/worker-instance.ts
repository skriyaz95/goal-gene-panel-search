const $findGenesWorker = new Worker("@/utils/workers/find-gene-webworker.js", {
  type: "module",
})

export default function(): Worker {
  return $findGenesWorker
}

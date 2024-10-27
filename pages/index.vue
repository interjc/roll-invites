<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
    <div class="max-w-md w-full backdrop-blur-md bg-white bg-opacity-20 rounded-xl shadow-lg overflow-hidden">
      <div class="p-8">
        <h1 class="text-3xl font-bold text-white mb-6 text-center">Follow.is Invitation Giveaway</h1>

        <div v-if="pending" class="text-white text-center">
          抽奖中...
        </div>

        <div v-else-if="error" class="text-red-300 text-center">
          {{ error.message }}
        </div>

        <div v-else class="space-y-6">
          <div class="p-4 rounded-lg"
            :class="data.success ? 'bg-green-400 bg-opacity-20' : 'bg-gray-400 bg-opacity-20'">
            <p class="text-2xl font-bold text-white text-center">{{ data.message }}</p>
            <div v-if="data.code"
              class="mt-4 font-mono bg-white bg-opacity-30 p-3 rounded-lg text-center text-white flex items-center justify-center">
              <span>激活码: {{ data.code }}</span>
              <button @click="copyCode" class="ml-2 focus:outline-none" title="复制激码">
                <UIcon name="i-heroicons-clipboard" class="h-5 w-5" />
              </button>
            </div>
            <p class="text-sm text-white mt-4 text-center">
              抽奖时间: {{ data.time }}
            </p>
          </div>

          <div class="flex justify-center">
            <button @click="refresh"
              class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
              再试一次
            </button>
          </div>
        </div>
      </div>
      <div class="pb-4">
        <p v-if="data.info" class="text-xs text-white text-opacity-50 mt-1 text-center">
          {{ data.info }}
        </p>
        <p class="text-xs text-white text-opacity-50 mt-1 text-center">
          中奖概率: {{ (data.winningProbability * 100).toFixed(2) }}%
        </p>
        <div class="flex justify-center space-x-4 mt-4">
          <a href="https://x.com/interjc" target="_blank" class="text-white hover:text-gray-200" title="关注我的 x 账号 @interjc">
            <UIcon name="i-simple-icons-x" class="h-6 w-6" />
          </a>
          <a href="https://s.zhaikr.com/vj" target="_blank" class="text-white hover:text-gray-200" title="关注我的公众号 justinjapan">
            <UIcon name="i-simple-icons-wechat" class="h-6 w-6" />
          </a>
          <a href="https://s.zhaikr.com/c" target="_blank" class="text-white hover:text-gray-200" title="欢迎购买 Web 开发入门课程">
            <UIcon name="i-heroicons-academic-cap" class="h-6 w-6" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data, pending, error, refresh } = useFetch('/api/raffle', {
  key: 'raffle'  // 用于刷新的唯一键
})

const showToastMessage = (message) => {
  // 创建一个新的 toast 元素
  const toast = document.createElement('div')
  toast.textContent = message
  toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300 opacity-0'
  document.body.appendChild(toast)

  // 淡入效果
  setTimeout(() => {
    toast.style.opacity = '1'
  }, 10)

  // 3秒后淡出并移除
  setTimeout(() => {
    toast.style.opacity = '0'
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}

const copyCode = () => {
  if (data.value && data.value.code) {
    navigator.clipboard.writeText(data.value.code)
      .then(() => {
        showToastMessage('激活码已复制到剪贴板')
      })
      .catch(err => {
        console.error('无法复制激活码: ', err)
        showToastMessage('复制失败，请手动复制')
      })
  }
}
</script>

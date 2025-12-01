<script lang="ts">
  type MessageRole = 'user' | 'podbot'

  interface Props {
    role: MessageRole
    content: string
  }

  let { role, content }: Props = $props()

  function getRoleColor(role: MessageRole): string {
    if (role === 'user') return 'text-redis-sky-blue'
    return 'text-redis-hyper dark:text-redis-yellow'
  }
</script>

<li class="bg-redis-white dark:bg-redis-black-90 border border-redis-black-10 dark:border-redis-dusk-70 rounded-lg p-3">
  <h4 class="text-xs font-semibold uppercase mb-1 {getRoleColor(role)}">
    {role}
  </h4>
  <p class="text-sm text-redis-black dark:text-redis-white font-mono leading-relaxed">
    {@html content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\r?\n/g, '<br>')}
  </p>
</li>

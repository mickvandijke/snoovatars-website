<template>
  <div class="px-4 md:px-6 py-12 flex flex-col gap-3 text-neutral-200 max-w-2xl">
    <h1>Delete Account Instructions</h1>
    <p>To delete your account, please follow the steps below:</p>

    <ol class="flex flex-col gap-2">
      <li>1. Compose an email to <a href="mailto:snoovatars@gmail.com" class="text-amber-500">snoovatars@gmail.com</a> from the email you signed up with.</li>
      <li>2. In the subject line, enter "Account Deletion Request"</li>
      <li>3. In the body of the email, include the following information:</li>
      <ul class="px-4">
        <li>3.1. A brief reason for your account deletion (optional)</li>
      </ul>
      <li>4. Click "Send" to submit your account deletion request.</li>
    </ol>

    <p>Please note that deleting your account is an irreversible process. Once your account is deleted, all associated data and information will be permanently removed.</p>

    <p>If you have any questions or encounter any issues during the account deletion process, please contact our support team at <a href="mailto:snoovatars@gmail.com">snoovatars@gmail.com</a>.</p>
  </div>
</template>

<script>
export default {
  name: "accountdeletion"
}
</script>

<style scoped>
h1 {
  @apply font-bold;
}
</style>

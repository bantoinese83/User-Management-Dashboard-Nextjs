const chatbotResponses = {
  'password reset': 'To reset your password, go to the login page and click on "Forgot Password".',
  'account locked': 'If your account is locked, please contact our support team at support@example.com.',
  'update email': 'You can update your email address in your account settings page.',
  'delete account': 'To delete your account, please go to your account settings and click on "Delete Account".',
}

export function getChatbotResponse(query: string): string {
  const lowerQuery = query.toLowerCase()
  for (const [keyword, response] of Object.entries(chatbotResponses)) {
    if (lowerQuery.includes(keyword)) {
      return response
    }
  }
  return "I'm sorry, I couldn't understand your query. Please contact our support team for further assistance."
}


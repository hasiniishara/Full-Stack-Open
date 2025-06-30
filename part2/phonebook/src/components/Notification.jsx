export const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type === 'error' ? 'errorMsg' : 'successMsg'}>
      {message}
    </div>
  )
}
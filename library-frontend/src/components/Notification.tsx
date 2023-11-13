import { useEffect } from 'react'

interface INotificationProps {
  notification: {
    type: string
    message: string
  },
  setNotification: ({ type, message }: { type: string, message: string }) => void
}

const Notification = ({ notification, setNotification }: INotificationProps) => {

  const style: React.CSSProperties = {
    color: notification.type === 'error' ? 'red' : 'green',
    display: notification.message ? 'block' : 'none',
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: "0 10px"
  }

  useEffect(() => {
    if (notification.message) {
      setTimeout(() => {
        setNotification({ type: '', message: '' })
      }, 5000)
    }
  })

  return (
    <div style={style}>
      <h2>{notification.message}</h2>
    </div>
  )
}


export default Notification
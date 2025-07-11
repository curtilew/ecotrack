


const EntryCard = ({ log }) => {
  const date = new Date(log.createdAt).toDateString()
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:px-6">{date}</div>
      <div className="px-4 py-4 sm:px-6">{log.activityType}</div>
      <div className="px-4 py-4 sm:px-6">{log.progress}</div>
      <div className="px-4 py-5 sm:p-6">{log.note}</div>
    </div>
  )
}


export default EntryCard
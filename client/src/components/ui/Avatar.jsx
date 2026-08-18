import defaultAvatar from '../../assets/icons/default-avatar.svg'

function Avatar({ src, size = 'md', className = '' }) {
  const sizeClass = size === 'sm' ? 'size-8' : size === 'lg' ? 'size-[50px]' : 'size-10'
  return (
    <img
      src={src || defaultAvatar}
      alt=""
      className={`${sizeClass} rounded-full object-cover ${className}`}
    />
  )
}

export default Avatar

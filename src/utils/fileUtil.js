function getFileType (type) {
  let fileType
  if (type === 'directory' || type === 'pdf' || type === 'exe' || type === 'html' || type === 'java' ||
    type === 'py') {
    fileType = type
  } else if (type === 'txt' || type === 'md') {
    fileType = 'txt'
  } else if (type === 'jpg' || type === 'png' || type === 'jpeg' || type === 'gif' || type === 'psd') {
    fileType = 'image'
  } else if (type === 'rar' || type === 'zip' || type === '7z' || type === 'tar' || type === 'gz') {
    fileType = 'zip'
  } else if (type === 'ppt' || type === 'pptx') {
    fileType = 'ppt'
  } else if (type === 'doc' || type === 'docx') {
    fileType = 'word'
  } else if (type === 'xls' || type === 'xlsx') {
    fileType = 'excel'
  } else if (type === 'wave' || type === 'mp3' || type === 'mpeg-4' || type === 'aac' || type === 'mpeg') {
    fileType = 'music'
  } else if (type === 'avi' || type === 'mp4' || type === '3gp' || type === 'rmvb' || type === 'flv') {
    fileType = 'video'
  } else {
    fileType = 'unkonwn'
  }
  return fileType
}

export function getIconName (type) {
  const fileType = getFileType(type)
  let iconName
  switch (fileType) {
    case 'directory':
      iconName = '#icon-wenjianjia'; break
    case 'pdf':
      iconName = '#icon-pdf'; break
    case 'exe':
      iconName = '#icon-exe'; break
    case 'html':
      iconName = '#icon-chrome'; break
    case 'java':
      iconName = '#icon-java'; break
    case 'py':
      iconName = '#icon-python'; break
    case 'txt':
      iconName = '#icon-txt'; break
    case 'image':
      iconName = '#icon-tupian'; break
    case 'zip':
      iconName = '#icon-zip'; break
    case 'ppt':
      iconName = '#icon-PPT'; break
    case 'excel':
      iconName = '#icon-Microsoft-Excel'; break
    case 'word':
      iconName = '#icon-WORD'; break
    case 'music':
      iconName = '#icon-file_music'; break
    case 'video':
      iconName = '#icon-videos'; break
    case 'unkonwn':
      iconName = '#icon-icon_weizhiwenjian'; break
  }
  return iconName
}

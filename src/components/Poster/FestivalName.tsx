import React from 'react'


const style = (): React.CSSProperties => {
  return {
    position: 'absolute',
    textAlign: 'center',
    color: 'tomato'
  }
}

interface Props {
  
}
const FestivalName: React.FC<Props> = () => {
  return (
    <div style={style()}>
      <h3>My Festival</h3>
    </div>
  )
}

export default FestivalName

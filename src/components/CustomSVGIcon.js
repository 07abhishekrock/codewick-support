const CustomSVGIcon = (props)=>{
    return (
        <i style={{
            width:'1em',
            height:'1em',
            display:'inline-grid',
            placeItems:'center',
            backgroundImage : `url(${props.iconURL})`,
            backgroundSize : 'contain',
            backgroundRepeat : 'no-repeat',
            backgroundPosition : 'center',
            color : 'inherit'
        }}></i>
    )
}

export default CustomSVGIcon;
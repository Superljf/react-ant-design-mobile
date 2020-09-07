import React from 'react';

 const CustomIconSVG = ({xlinkHref}) => {
   return (
     <svg className='customIcon' aria-hidden="true">
       <use xlinkHref={`#${xlinkHref}`} />
     </svg>
    )
};

   // CustomIconSVG.propTypes = {
   //   xlinkHref: React.PropTypes.string.isRequired
   // };

export default CustomIconSVG;

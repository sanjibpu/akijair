// components/Tooltip.js
import React, { useState } from 'react';
import { FaPlaneCircleCheck } from "react-icons/fa6";
import { TiPlane } from "react-icons/ti";
import { IoBagHandleOutline } from "react-icons/io5";



const Tooltip = ({ routs, img }) => {
    const [visible, setVisible] = useState(false);
    console.log(routs)
    return (
        <div className="relative flex items-center">

            <IoBagHandleOutline
                className="w-fit hover:cursor-help"
                onMouseOver={() => setVisible(true)}
                onMouseOut={() => setVisible(false)}
            />
            {visible && (
                <div className="absolute w-96 bottom-full left-0 text-black  bg-white transform -translate-x-1/2 mb-2  text-sm rounded-lg py-4 pl-3 pr-2 opacity-1 transition-opacity duration-300 tooltip-visible shadow-md ">

                    <div className='flex gap-3 items-center'>
                        <div> {img && (<img src={img} alt='Img' width={66} />)}</div>
                        <div>
                            <h3 className='text-[#444] text-xl font-medium'>
                                {routs?.operating?.carrier_name}
                            </h3>
                        </div>
                    </div>
                    <h3 className="flex items-center gap-2">
                        <FaPlaneCircleCheck />
                        Booking Class : {routs?.booking_class?.cabin_class}
                    </h3>
                    <h3 className="flex items-center gap-2">
                        <TiPlane />
                        Aircraft : {routs?.aircraft?.code}
                    </h3>

                    <div className='mt-2'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th > Passenger</th>
                                    <th > Baggage</th>
                                    <th > Hand Baggage</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td className='p-2'>{routs?.baggages?.checked?.adt?.title}</td>
                                    <td className='p-2'>{routs?.baggages?.carry_on?.adt?.title}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Tooltip;
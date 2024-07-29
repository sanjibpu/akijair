
'use client'

import Image from "next/image";
import { useEffect, useState } from "react";




export default function Home() {
    // const data = await getData()

    // console.log(data, 'data')



    const [flights, setFlights] = useState([]);
    const [flightsResource, setFlightsResource] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const raw = JSON.stringify({
                    "journey_type": "OneWay",
                    "segment": [
                        {
                            "departure_airport_type": "AIRPORT",
                            "departure_airport": "DAC",
                            "arrival_airport_type": "AIRPORT",
                            "arrival_airport": "CXB",
                            "departure_date": "2024-08-05"
                        }
                    ],
                    "travelers_adult": 1,
                    "travelers_child": 0,
                    "travelers_child_age": 0,
                    "travelers_infants": 0,
                    "travelers_infants_age": [
                        ""
                    ],
                    "preferred_carrier": [
                        null
                    ],
                    "non_stop_flight": "any",
                    "baggage_option": "any",
                    "booking_class": "Economy",
                    "supplier_uid": "all",
                    "partner_id": "",
                    "language": "en"
                });



                const requestOptions = {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: raw,
                    // redirect: "follow"
                };


                const res = await fetch("https://content.akijair.com/api/FlightService/FlightSearchAkijAir", requestOptions)
                const data = await res.json()
                setFlights(data.data)
                setFlightsResource(data.resources?.base_url)
                setLoading(false);


            } catch (error) {
                console.error('Error fetching flights:', error);
                setLoading(false);
            }
        };

        fetchFlights();
    }, []);


    // console.log(flightsResource?.carrier, 'res')


    const dateFormat = (date_value) => {
        const date = new Date(date_value);

        // Get time components
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        // Get day and date components
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayOfMonth = date.toLocaleDateString('en-US', { month: 'short' });
        const month = date.getMonth() + 1; // Months are zero-indexed (0 = January, 1 = February, etc.)
        const year = date.getFullYear();

        // Format time with leading zeros
        const padZero = (num) => num.toString().padStart(2, '0');


        let data_obj = {
            hour: padZero(hours),
            minutes: padZero(minutes),
            dayOfWeek: dayOfWeek,
            dayOfMonth: dayOfMonth,
            month: padZero(month),
            year: year,
        }

        return data_obj;



    }


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div>

                <table class="table-fixed">
                    <tbody>
                        {Object.entries(flights).map((value, key) => {

                            let flight_group = value[1]?.flight_group[0];
                            let routs = flight_group?.routes[0]
                            // console.log(value[1]?.flight_group[0])
                            let img_src = '';
                            if (flightsResource?.carrier && routs?.operating?.carrier_logo)
                                img_src = flightsResource?.carrier + '/' + routs?.operating?.carrier_logo;

                            let departure_formated_date = dateFormat(routs?.departure_time)
                            let arrival_time_formated_date = dateFormat(routs?.arrival_time)


                            return (<>
                                <tr key={key}>
                                    <td>
                                        <p> {img_src && (<> <img src={`${img_src}`} height={50} /> </>)} </p>
                                        <p> {routs?.operating?.carrier_name}</p>
                                        <p>
                                            booking_class - {routs?.booking_class?.cabin_class}
                                        </p>
                                        <p>
                                            aircraft - {routs?.aircraft?.code}
                                        </p>
                                        <p>
                                            includedBaggage - {routs?.includedBaggage}
                                        </p>

                                    </td>
                                    <td>
                                        <p>
                                            {departure_formated_date?.hour}:{departure_formated_date?.minutes}
                                            <br />
                                            {departure_formated_date?.dayOfWeek}, {departure_formated_date?.month} {departure_formated_date?.dayOfMonth}  {departure_formated_date?.year}
                                        </p>
                                        <p>
                                            {routs?.origin_airport?.city}
                                        </p>
                                        <p>
                                            {routs?.origin_airport?.name}
                                        </p>
                                    </td>
                                    <td>
                                        {flight_group?.no_of_stops_title}
                                    </td>
                                    <td>
                                        <p>
                                            {arrival_time_formated_date?.hour}:{arrival_time_formated_date?.minutes}
                                            <br />
                                            {arrival_time_formated_date?.dayOfWeek}, {arrival_time_formated_date?.month} {arrival_time_formated_date?.dayOfMonth}  {arrival_time_formated_date?.year}
                                        </p>
                                        <p> {routs?.destination_airport?.city}</p>
                                        <p>{routs?.destination_airport?.name}</p>
                                    </td>
                                    <td>
                                        <p> {value[1]?.price?.total?.amount}</p>
                                        <p> {value[1]?.price?.total?.currency}</p>
                                    </td>
                                </tr>
                            </>);
                        })}
                    </tbody>
                </table>
            </div>

            {/* <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product name
              </th>
              <th scope="col" className="px-6 py-3">
                Color
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Apple MacBook Pro 17"
              </th>
              <td className="px-6 py-4">
                Silver
              </td>
              <td className="px-6 py-4">
                Laptop
              </td>
              <td className="px-6 py-4">
                $2999
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Microsoft Surface Pro
              </th>
              <td className="px-6 py-4">
                White
              </td>
              <td className="px-6 py-4">
                Laptop PC
              </td>
              <td className="px-6 py-4">
                $1999
              </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Magic Mouse 2
              </th>
              <td className="px-6 py-4">
                Black
              </td>
              <td className="px-6 py-4">
                Accessories
              </td>
              <td className="px-6 py-4">
                $99
              </td>
            </tr>
          </tbody>
        </table>
      </div> */}

        </>
    );
}

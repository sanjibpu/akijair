
'use client'

import Image from "next/image";
import { useEffect, useState } from "react";


export default function Home() {
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


    const getTimeDifferenceInHoursAndMinutes = (startTimeString, endTimeString) => {
        // Parse the input strings into Date objects
        const startTime = new Date(startTimeString);
        const endTime = new Date(endTimeString);
        // Calculate the time difference in milliseconds
        const timeDifferenceMs = endTime - startTime;
        // Convert milliseconds to hours
        const hours = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
        // Calculate remaining minutes
        const minutes = Math.floor((timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60));
        const padZero = (num) => num.toString().padStart(2, '0');
        return { hours: padZero(hours), minutes: padZero(minutes) };
    }

    return (
        <>
            <div>
                {loading && (<div>Loading...</div>)}
                {Object.entries(flights).map((value, key) => {

                    let flight_group = value[1]?.flight_group[0];
                    let routs = flight_group?.routes[0]
                    let img_src = '';
                    if (flightsResource?.carrier && routs?.operating?.carrier_logo)
                        img_src = flightsResource?.carrier + '/' + routs?.operating?.carrier_logo;

                    let departure_formated_date = dateFormat(routs?.departure_time)
                    let arrival_time_formated_date = dateFormat(routs?.arrival_time)

                    const timeDifference = getTimeDifferenceInHoursAndMinutes(routs?.departure_time, routs?.arrival_time);


                    return (<>
                        <div className="flex flex-col items-center gap-12 px-3 py-4 sm:flex-row justify-evenly gap-x-5 md:gap-x-8">

                            <div className="flex gap-3 sm:col-span-2">
                                <div className="w-16">
                                    {img_src && (<Image src={img_src} height={66} width={66} loading="lazy"
                                    />)}
                                </div>

                                <div>
                                    <h5> {routs?.operating?.carrier_name}</h5>
                                    <p>
                                        booking_class - {routs?.booking_class?.cabin_class}
                                    </p>
                                    <p>
                                        aircraft - {routs?.aircraft?.code}
                                    </p>
                                    <p>
                                        includedBaggage - {routs?.includedBaggage}
                                    </p>
                                </div>
                            </div>
                            <div className="text-center">
                                <h4 className="text-2xl font-bold"> {departure_formated_date?.hour}:{departure_formated_date?.minutes}</h4>
                                <p className="text-xs text-neutral"> {departure_formated_date?.dayOfWeek}, {departure_formated_date?.month} {departure_formated_date?.dayOfMonth}  {departure_formated_date?.year}</p>

                                <h3 className="font-medium">
                                    {routs?.origin_airport?.city}
                                </h3>
                                <p className="text-xs text-neutral">
                                    {routs?.origin_airport?.name}
                                </p>
                            </div>
                            <div className="">
                                {timeDifference.hours}H {timeDifference.minutes}M


                                <br />
                                {flight_group?.no_of_stops_title}

                            </div>
                            <div className="text-center">
                                <h4 className="text-2xl font-bold"> {arrival_time_formated_date?.hour}:{arrival_time_formated_date?.minutes}</h4>
                                <p className="text-xs text-neutral">
                                    {arrival_time_formated_date?.dayOfWeek}, {arrival_time_formated_date?.month} {arrival_time_formated_date?.dayOfMonth}  {arrival_time_formated_date?.year}
                                </p>

                                <h3 className="font-medium">
                                    {routs?.destination_airport?.city}
                                </h3>
                                <p className="text-xs text-neutral">
                                    {routs?.destination_airport?.name}
                                </p>


                            </div>
                            <div className="">
                                <p> {value[1]?.price?.total?.amount}</p>
                                <p> {value[1]?.price?.total?.currency}</p>
                            </div>

                        </div>
                    </>);
                })}
            </div>
        </>
    );
}

import { useEffect, useState } from 'react';
import { Client } from '../interface/Client';
import { useFirebase } from '../../utils/FirebaseContext';

const transformDataClient = (data: Record<string, any>): Client[] => {
    return Object.entries(data).map(([key, value]) => ({
        id: key,
        title: value.title,
        image: value.image,
    }));
};

const Slider = () => {
    const { getFromDatabase } = useFirebase();
    const [clientData, setClientData] = useState<Client[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        getFromDatabase('client').then(data => {
            if (data) {
                const transformedData = transformDataClient(data);
                setClientData(transformedData);
                console.log(transformedData);
            }
        });
    }, []);

    const ITEMS_PER_SLIDE = 4;

    const handlePrev = () => {
        setCurrentIndex(prev =>
            prev === 0 ? Math.max(0, clientData.length - ITEMS_PER_SLIDE) : prev - ITEMS_PER_SLIDE
        );
    };

    const handleNext = () => {
        setCurrentIndex(prev =>
            prev + ITEMS_PER_SLIDE >= clientData.length ? 0 : prev + ITEMS_PER_SLIDE
        );
    };

    const currentItems = clientData.slice(
        currentIndex,
        currentIndex + ITEMS_PER_SLIDE
    );

    return (
        <div className=" w-full mx-auto relative">
            {/* Image Container */}
            <div className="flex justify-around items-center h-full w-full px-12 mt-8 space-x-4">
                {currentItems.map((client, index) => (
                    <img
                        key={index}
                        src={client.image}
                        className="w-32 object-contain"
                        alt={client.title}
                    />
                ))}
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={handlePrev}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
            >
                {'<'}
            </button>
            <button
                onClick={handleNext}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
            >
                {'>'}
            </button>
        </div>
    );
};

export default Slider;

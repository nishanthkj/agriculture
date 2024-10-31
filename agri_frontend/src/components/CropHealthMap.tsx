import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const CropHealthMap = () => {
    // Define the position with the correct type
    const position: [number, number] = [51.505, -0.09]; // Example position

    return (
        <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
                <Popup>
                    Crop Health Data Here
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default CropHealthMap;

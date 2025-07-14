function ServiceCard({ service }) {
  return (
    <div className="bg-white text-black p-4 rounded-lg shadow-md">
      <img src={service.imageUrl} alt={service.name} className="w-full h-32 object-cover rounded mb-2" />
      <h3 className="text-lg font-bold">{service.name}</h3>
      <p className="text-gray-600">Price: ${service.price}</p>
    </div>
  );
}

export default ServiceCard;
import React from 'react';

interface Size {
  index: number;
  size: number;
  code: string;
  name: string;
  price: number;
}

const SizesAndTariffs = () => {
  const [sizes, setSizes] = React.useState<Size[]>([
    { index: 1, size: 80, code: '101', name: 'מגורים רגיל', price: 100 },
    { index: 2, size: 20, code: '102', name: 'מרפסת', price: 80 },
    { index: 3, size: 15, code: '103', name: 'מחסן', price: 50 }
  ]);

  const handleSizeChange = (index: number, newSize: number) => {
    setSizes(sizes.map(size => 
      size.index === index ? { ...size, size: newSize } : size
    ));
  };

  const addSize = () => {
    setSizes([...sizes, {
      index: sizes.length + 1,
      size: 0,
      code: '',
      name: '',
      price: 0
    }]);
  };

  const deleteSize = (index: number) => {
    setSizes(sizes.filter(size => size.index !== index));
  };

  const totalSize = sizes.reduce((sum, size) => sum + size.size, 0);

  return (
    <div className="mt-6 space-y-4">
      <div className="border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-right">מס׳</th>
              <th className="p-2 text-right">גודל</th>
              <th className="p-2 text-right">קוד תעריף</th>
              <th className="p-2 text-right">שם תעריף</th>
              <th className="p-2 text-right">תעריף</th>
              <th className="p-2 text-right">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((size) => (
              <tr key={size.index}>
                <td className="p-2">{size.index}</td>
                <td className="p-2">
                  <input
                    type="number"
                    className="w-20 p-1 border rounded"
                    value={size.size}
                    onChange={(e) => handleSizeChange(size.index, Number(e.target.value))}
                  />
                </td>
                <td className="p-2">{size.code}</td>
                <td className="p-2">{size.name}</td>
                <td className="p-2">₪{size.price}</td>
                <td className="p-2">
                  <button
                    onClick={() => deleteSize(size.index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    מחק
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6} className="p-2">
                <button
                  onClick={addSize}
                  className="text-blue-600 hover:text-blue-800"
                >
                  + הוסף גודל חדש
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="text-sm bg-gray-50 p-2 rounded flex justify-between">
        <span>סה"כ שטח:</span>
        <span>{totalSize} מ"ר</span>
      </div>
    </div>
  );
};

export default SizesAndTariffs;

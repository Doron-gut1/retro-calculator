// ... הקוד הקיים נשאר אותו דבר, רק נשנה את handleSizeChange

  const handleSizeChange = (index: number, newSize: number) => {
    console.log('Updating size at RetroCalculator:', index, newSize);
    const newSizes = sizes.map((size, i) => 
      i === index ? { ...size, size: newSize } : size
    );
    console.log('New sizes array:', newSizes);
    setSizes(newSizes);
  };

// ... שאר הקוד נשאר אותו דבר
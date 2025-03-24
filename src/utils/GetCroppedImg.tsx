/**
 * Fungsi untuk membuat elemen Image dari URL
 */
function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // Untuk menghindari masalah CORS
      image.src = url;
    });
  }
  
  /**
   * Fungsi getCroppedImg:
   * - imageSrc: sumber URL gambar asli
   * - pixelCrop: area crop (x, y, width, height) dalam pixel
   * - rotation: nilai rotasi (dalam derajat)
   *
   * Mengembalikan URL object dari gambar hasil crop dan rotasi.
   */
  export default async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    rotation = 0
  ): Promise<string> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    if (!ctx) {
      throw new Error("Canvas context tidak tersedia");
    }
  
    // Hitung dimensi 'safe area' untuk mengakomodasi rotasi
    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));
  
    // Set canvas ke safe area untuk menghindari cropping yang tidak diinginkan saat rotasi
    canvas.width = safeArea;
    canvas.height = safeArea;
  
    // Pindahkan konteks ke tengah dan lakukan rotasi
    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);
  
    // Gambar gambar asli di tengah safe area
    ctx.drawImage(
      image,
      (safeArea - image.width) / 2,
      (safeArea - image.height) / 2
    );
  
    // Dapatkan data gambar dari area safe yang telah digambar
    const data = ctx.getImageData(
      (safeArea - image.width) / 2 + pixelCrop.x,
      (safeArea - image.height) / 2 + pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height
    );
  
    // Atur ulang canvas ke ukuran crop yang diinginkan
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
  
    // Tempatkan data gambar yang telah dicrop ke canvas yang baru
    ctx.putImageData(data, 0, 0);
  
    // Konversi canvas menjadi blob dan buat URL object untuk dikembalikan
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas kosong"));
          return;
        }
        const croppedImageUrl = URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      }, "image/jpeg");
    });
  }
  
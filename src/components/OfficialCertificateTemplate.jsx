import React, { forwardRef } from "react";

const OfficialCertificateTemplate = forwardRef(({ order, adminText }, ref) => {
  if (!order) return null;

  const today = new Date().toLocaleDateString("ru-RU");

  return (
    <div
      ref={ref}
      className="w-[794px] min-h-[1123px] bg-white text-black p-12 font-serif relative overflow-hidden flex flex-col"
      style={{
        fontFamily: '"Times New Roman", Times, serif',
      }}
    >
      <div className="text-center font-bold text-[15px] leading-snug mb-4 tracking-wide uppercase">
        <div>ҚАЗАҚСТАН РЕСПУБЛИКАСЫ АСТАНА ҚАЛАСЫНЫҢ МЕМЛЕКЕТТІК АРХИВІ</div>
        <div>ГОСУДАРСТВЕННЫЙ АРХИВ ГОРОДА АСТАНЫ</div>
      </div>

      <hr className="border-black border-t-2 my-2" />

      <div className="flex justify-between items-start mt-6 text-[15px] leading-relaxed">
        <div>
          <div>
            <strong>Күні / Дата:</strong> {today}
          </div>
          <div>
            <strong>Шығыс № / Исх. №:</strong> REQ-{order.id}
          </div>
        </div>
        <div className="text-right max-w-[50%]">
          <div>
            <strong>Кімге / Кому:</strong>
          </div>
          <div className="font-semibold">{order.full_name}</div>
          {order.type && (
            <div className="mt-2 text-sm italic">
              Сұраныс түрі / Тип запроса:
              <br />
              {order.type}
            </div>
          )}
        </div>
      </div>

      <div className="text-center font-bold text-xl mt-16 mb-10 tracking-widest uppercase">
        <div>МҰРАҒАТТЫҚ АНЫҚТАМА</div>
        <div className="mt-2">АРХИВНАЯ СПРАВКА</div>
      </div>

      <div className="text-[15px] leading-[1.8] whitespace-pre-wrap flex-grow text-justify indent-8">
        {adminText}
      </div>

      <div className="mt-20 mb-10 text-[15px] font-bold w-full">
        <div className="flex justify-between items-end mb-10">
          <div>Архив директоры / Директор архива</div>
          <div className="border-b border-black w-48 text-center pb-1"></div>
        </div>

        <div className="flex justify-between items-end">
          <div className="font-normal text-sm">Орындаушы / Исполнитель</div>
          <div className="border-b border-black w-48 text-center pb-1"></div>
        </div>
      </div>
    </div>
  );
});

OfficialCertificateTemplate.displayName = "OfficialCertificateTemplate";

export default OfficialCertificateTemplate;

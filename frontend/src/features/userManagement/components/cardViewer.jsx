import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";

import { resolveApiAssetUrl } from "../../../service/api";

function CardFront({ item }) {
  const barcodeValue = String(item?.nik ?? "").trim() || "000000";
  const imageSrc = item?.foto ? resolveApiAssetUrl(item.foto) : "";

  return (
    <div
      className="
        relative overflow-hidden rounded-2xl bg-center bg-no-repeat
        bg-[length:550%] flex flex-col items-center justify-between pt-10 pb-2
        w-[220px] [aspect-ratio:0.663]
      "
      style={{ backgroundImage: "url('assets/images/card.png')" }}
    >
      <div className="flex flex-col items-center">
        <p className="font-bold tracking-tighter">BPK PENABUR JAKARTA</p>
        <img
          src="/assets/images/logo_penabur.png"
          alt="Logo BPK Penabur"
          className="w-1/4"
        />
      </div>

      {imageSrc ? (
        <img
          src={imageSrc}
          alt={item?.nama_lengkap || "Foto karyawan"}
          className="overflow-hidden w-[100px] [aspect-ratio:1] rounded-md object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div className="overflow-hidden bg-green-200 w-[100px] [aspect-ratio:1]" />
      )}

      <div className="text-center">
        <p className="font-bold font-TimesNewRoman">{item?.nama_lengkap}</p>
        <p className="font-bold font-TimesNewRoman">{item?.nik}</p>
      </div>

      <Barcode
        value={barcodeValue}
        width={1.5}
        height={20}
        margin={0}
        background=""
        displayValue={false}
      />
    </div>
  );
}

function CardBack() {
  return (
    <div
      className="
        rounded-2xl border-2 text-center
        w-[220px] [aspect-ratio:0.663]
        relative
      "
    >
      <ol
        start={1}
        className="list-decimal list-outside font-TimesNewRoman text-left leading-3 text-[0.6rem] space-y-2 pl-7 pr-3 pt-10"
      >
        <li>
          Kartu ini berlaku sebagai pengatar sementara masuk rumah sakit rujukan
          BPK PENABUR Jakarta.
        </li>
        <li>
          Kartu ini berlaku sebagai ID Card dan wajib di pakai selama jam kerja.
        </li>
        <li>
          Penyalahgunaan kartu ini di luar tanggung jawab BPK PENABUR Jakarta.
        </li>
        <li>
          Kerusakan/kehilangan kartu ini akan dikenakan biaya penggantian.
        </li>
        <li>Apabila menemukan/berhenti/pensiun harap di kembalikan ke :</li>
      </ol>

      <p className="font-TimesNewRoman font-bold text-[0.67rem] px-8 leading-3 pt-3 mb-1">
        BPK PENABUR Jakarta Gedung UKRIDA
      </p>
      <p className="font-TimesNewRoman leading-3 text-[0.63rem] px-5">
        Blok E, Lt. 6
      </p>
      <p className="font-TimesNewRoman leading-3 text-[0.63rem] px-5">
        Jl. Tanjung Duren Raya No. 4
      </p>
      <p className="font-TimesNewRoman leading-3 text-[0.63rem] px-5">
        Jakarta Barat 11470
      </p>
      <p className="font-TimesNewRoman leading-3 text-[0.63rem] px-5">
        Telp.(021)5666965-66(Hunting)
      </p>
    </div>
  );
}

export const CardViewer = ({ item }) => {
  const contentRef = useRef(null);
  const safeItem = item ?? {};

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Kartu-${safeItem.nik ?? "karyawan"}`,
    removeAfterPrint: false,
  });

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="border-b border-slate-200 text-base font-semibold text-slate-950 dark:border-slate-800 dark:text-slate-100">
            Cetak Kartu
          </ModalHeader>
          <ModalBody className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-10">
            <div className="flex flex-col items-center gap-2">
              <CardFront item={safeItem} />

              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Tampak Depan
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <CardBack />

              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Tampak Belakang
              </p>
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-slate-200 dark:border-slate-800">
            <Button
              color="danger"
              variant="light"
              onPress={onClose}
              radius="sm"
              className="personalia-action-button personalia-action-button-light"
            >
              Tutup
            </Button>
            <Button
              color="primary"
              onPress={handlePrint}
              radius="sm"
              className="personalia-action-button personalia-action-button-primary"
            >
              Cetak
            </Button>
          </ModalFooter>

          <div ref={contentRef} className="hidden print:block" aria-hidden>
            <section className="w-full min-h-screen flex items-center justify-center p-6 print:[page-break-after:always]">
              <CardFront item={safeItem} />
            </section>
            <section className="w-full min-h-screen flex items-center justify-center p-6">
              <CardBack />
            </section>
          </div>
        </>
      )}
    </ModalContent>
  );
};

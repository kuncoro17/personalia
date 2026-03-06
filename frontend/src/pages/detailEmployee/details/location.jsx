import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDisclosure } from "@heroui/react";
import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";

import { apiClient, apiService } from "../../../service/api";
import Modals from "../components/modals";
import Loading from "../../../components/common/Loading";
import { useMaster } from "../../../hooks/useMaster";
import { cloneDeep, setByPath } from "../../../utils/flatten";
import { onDelete } from "../../../utils/detailService";
import { uniqById } from "../../../utils/uniqueValue";
import { formatDataDetail } from "../../../utils/format";

import { PROPERTIES } from "../constant";
import { DETAILENDPOINT, MASTERENDPOINT } from "../../../constants/api";

export default function Location() {
  const { getToken } = useAuth();
  const api = apiClient(getToken);

  const queryClient = useQueryClient();
  const { state } = useLocation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedEdit, setSelectedEdit] = useState(null);

  const { data: location, isFetching: locationFetching } = useMaster(
    api,
    [`lokasi-${state.id}`],
    DETAILENDPOINT.get.location(state.id),
    {
      select: (res) => {
        const rows = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.unit_kerja)
            ? res.data.unit_kerja
            : [];

        return rows.map((d) => {
          const formatted = formatDataDetail("lokasi", d);
          formatted.id = d.id;
          return formatted;
        });
      },
    },
  );

  const { data: masterMapel, isFetching: masterMapelFetching } = useMaster(
    api,
    ["master-mapel"],
    MASTERENDPOINT.mapel,
    {
      enabled: isOpen,
      select: (data) => {
        const unique = uniqById(data.data, "nama_mapel");
        return unique.map((i) => ({
          id: i.mapel_id,
          name: i.nama_mapel,
        }));
      },
    },
  );

  const { data: masterLokasiKerja, isFetching: masterLokasiKerjaFetching } =
    useMaster(api, ["master-lokasi-kerja"], MASTERENDPOINT.lokasiKerja, {
      enabled: isOpen,
      select: (data) => {
        const getId = (node) => node?.id ?? node?.kode ?? null;
        const getName = (node) =>
          node?.nama ??
          node?.name ??
          node?.nama_sek ??
          node?.nama_bag ??
          node?.nama_div ??
          node?.nama_dep ??
          node?.nama_dir ??
          null;
        const resolveOption = (node) => {
          const id = getId(node);
          const name = getName(node);

          if (name && name !== "None") return { id, name };
          if (id && id !== "nnn") return { id, name: String(id) };

          return null;
        };

        const formattedData = (data?.data ?? []).reduce((acc, item) => {
          const pushData = {
            id: item?.id ?? item?.uk_id ?? null,
          };

          const seksiOption = resolveOption(item?.seksi);
          const bagianOption = resolveOption(item?.bagian);
          const divisiOption = resolveOption(item?.divisi);
          const deputiOption = resolveOption(item?.deputi);
          const direkturOption = resolveOption(item?.direktur);

          if (seksiOption) {
            pushData.name = seksiOption.name;
            pushData.kode = seksiOption.id;
          } else if (bagianOption) {
            pushData.name = bagianOption.name;
            pushData.kode = bagianOption.id;
          } else if (divisiOption) {
            pushData.name = divisiOption.name;
            pushData.kode = divisiOption.id;
          } else if (deputiOption) {
            pushData.name = deputiOption.name;
            pushData.kode = deputiOption.id;
          } else if (direkturOption) {
            pushData.name = direkturOption.name;
            pushData.kode = direkturOption.id;
          }

          if (pushData.name && pushData.id) acc.push(pushData);
          return acc;
        }, []);

        return formattedData;
      },
    });

  const { data: masterJabatan, isFetching: masterJabatanFetching } = useMaster(
    api,
    ["jabatan"],
    MASTERENDPOINT.jabatan,
    {
      enabled: isOpen,
      select: (data) => {
        const unique = uniqById(data.data, "jabatan");
        return unique.map((i) => ({
          id: i.kode_jab,
          name: i.jabatan,
        }));
      },
    },
  );

  const master = { masterMapel, masterLokasiKerja, masterJabatan };
  const isLoading =
    masterMapelFetching || masterLokasiKerjaFetching || masterJabatanFetching;
  const hasLocation = (location || []).length > 0;

  const locationInput = useMemo(() => {
    let updatedLocation = PROPERTIES.lokasi;

    if (selectedEdit !== null) updatedLocation = location[selectedEdit];

    if (isOpen && !isLoading && location) {
      return updatedLocation.map((item) => {
        if (item.form === "select") {
          return {
            ...item,
            listSelect: master[item.master],
          };
        }

        return item;
      });
    }

    return updatedLocation;
  }, [isOpen, location, master, selectedEdit, isLoading]);

  const onUpdate = async (value, onClose) => {
    try {
      const unitKerjaPayload = {};
      const jamMengajarPayload = {};

      Object.keys(value).forEach((key) => {
        const dataProp = PROPERTIES.lokasi.find((i) => i.properties === key);
        if (!dataProp) return;

        if (dataProp.master) {
          const findSelected = master[dataProp.master].find(
            (i) => i.name === value[key],
          );

          if (!findSelected) return;

          if (key === "lokasi_kerja") {
            unitKerjaPayload.unit_kerja = findSelected.id;
            jamMengajarPayload.lokasi_kerja = findSelected.id;
            return;
          }

          if (key === "jabatan") {
            unitKerjaPayload.jab_id = findSelected.id;
            jamMengajarPayload.jabatan = findSelected.id;
            return;
          }

          if (key === "mengajar_mapel") {
            jamMengajarPayload.mengajar_mapel = findSelected.id;
            return;
          }

          jamMengajarPayload[key] = findSelected.id;
          return;
        }

        if (key === "jam_mengajar") {
          jamMengajarPayload.jam_mengajar = Number(value[key]);
          return;
        }

        jamMengajarPayload[key] = value[key];
      });

      const ukkId = location[selectedEdit].id;

      if (Object.keys(unitKerjaPayload).length > 0) {
        await apiService(
          "put",
          api,
          DETAILENDPOINT.update.location(ukkId),
          unitKerjaPayload,
        );
      }

      if (Object.keys(jamMengajarPayload).length > 0) {
        await apiService(
          "put",
          api,
          DETAILENDPOINT.update.locationMapel(state.id, ukkId),
          jamMengajarPayload,
        );
      }

      queryClient.setQueryData([`lokasi-${state.id}`], (oldRaw) => {
        if (!oldRaw) return oldRaw;

        const next = cloneDeep(oldRaw);

        for (const [path, v] of Object.entries(value || {})) {
          setByPath(next, `${selectedEdit}.${path}`, v);
        }

        return next;
      });

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const onNew = async (value, onClose) => {
    try {
      const lokasiSelected = (master.masterLokasiKerja || []).find(
        (i) => i.name === value?.lokasi_kerja,
      );
      const jabatanSelected = (master.masterJabatan || []).find(
        (i) => i.name === value?.jabatan,
      );

      if (!lokasiSelected?.id || !jabatanSelected?.id) return;

      const dataValue = {
        karyawan_id: state.id,
        unit_kerja: lokasiSelected.id,
        jab_id: jabatanSelected.id,
        lokasi_penggajian: "",
      };

      const resp = await apiService(
        "post",
        api,
        DETAILENDPOINT.create.location(),
        dataValue,
      );

      if (!resp?.success) throw resp;

      await queryClient.invalidateQueries({
        queryKey: [`lokasi-${state.id}`],
      });

      onClose?.();
    } catch (err) {
      console.error(err);
    }
  };

  if (locationFetching) return <Loading />;

  return (
    <div className="w-full flex flex-col gap-5">
      {!hasLocation ? (
        <div className="flex justify-center items-center flex-1 flex-col gap-10">
          <p className="font-Poppins">Tidak ada data Lokasi Kerja</p>

          <button
            type="button"
            className="flex items-center gap-2"
            onClick={() => {
              setSelectedEdit(null);
              onOpen();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="#344561"
                d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"
              />
            </svg>

            <p className="font-Poppins font-semibold text-primary">
              Tambah Data Lokasi
            </p>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {location.map((item, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex w-full justify-between border-b-1 border-primary border-opacity-20 py-2">
                <p className="font-Poppins font-extrabold text-lg text-primary">
                  Lokasi Kerja {index === 0 ? "Utama" : index + 1}
                </p>

                <div className="flex gap-5">
                  {index > 0 && (
                    <button
                      onClick={() =>
                        onDelete(
                          queryClient,
                          index,
                          "unit_kerja_karyawan",
                          `lokasi-${state.id}`,
                        )
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#8C2526"
                          d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z"
                        />
                      </svg>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedEdit(index);
                      onOpen();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#344561"
                        d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6.525q.5 0 .75.313t.25.687t-.262.688T11.5 5H5v14h14v-6.525q0-.5.313-.75t.687-.25t.688.25t.312.75V19q0 .825-.587 1.413T19 21zm4-7v-2.425q0-.4.15-.763t.425-.637l8.6-8.6q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4t-.137.738t-.438.662l-8.6 8.6q-.275.275-.637.438t-.763.162H10q-.425 0-.712-.288T9 14m12.025-9.6l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-5">
                {item.map((item) => {
                  if (item.title !== "Id") {
                    return (
                      <div key={item.title}>
                        <p className="font-Poppins font-normal opacity-50 text-sm">
                          {item.title}
                        </p>
                        <p className="font-Poppins font-medium truncate text-primary">
                          {item.value?.name ?? item.value}
                        </p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {hasLocation && (
        <button
          className="bg-[#00000010] rounded-md h-10 flex items-center justify-center w-full"
          onClick={() => {
            onOpen();
            setSelectedEdit(null);
          }}
        >
          <i className="fi fi-rr-plus" />
        </button>
      )}

      <Modals
        data={locationInput ?? PROPERTIES.lokasi}
        title={`${selectedEdit !== null ? "Edit" : "Tambah"} Lokasi Kerja${
          selectedEdit === null
            ? ""
            : selectedEdit === 0
              ? " Utama"
              : ` ${selectedEdit + 1}`
        }`}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onUpdate={(value, onClose) =>
          selectedEdit !== null
            ? onUpdate(value, onClose)
            : onNew(value, onClose)
        }
        isLoading={isLoading}
        allowSubmitWithoutChange={selectedEdit === null}
      />
    </div>
  );
}

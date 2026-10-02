import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { Checkbox, useDisclosure } from "@heroui/react";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useMemo, useState } from "react";

import { apiClient, apiService } from "../../../service/api";
import Modals from "../components/modals";
import Loading from "../../../components/common/Loading";
import { useMaster } from "../../../hooks/useMaster";
import { setByPath } from "../../../utils/flatten";
import { uniqById } from "../../../utils/uniqueValue";
import { formatDataDetail } from "../../../utils/format";
import { PROPERTIES } from "../constant";
import { DETAILENDPOINT, MASTERENDPOINT } from "../../../constants/api";

const SELECT_TITLE_TO_STATE_KEY = {
  direktur: "direktur",
  deputi: "deputi",
  divisi: "divisi",
  "bagian/biro/sekolah": "bagian",
  seksi: "seksi",
};

const resetUnits = {
  direktur: ["deputi", "divisi", "bagian", "seksi"],
  deputi: ["divisi", "bagian", "seksi"],
  divisi: ["bagian", "seksi"],
  bagian: ["seksi"],
  seksi: [],
};

export default function Profile() {
  const { getToken } = useAuth();
  const api = apiClient(getToken);

  const queryClient = useQueryClient();
  const { state } = useLocation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [valueSelect, setValueSelect] = useState({
    direktur: null,
    deputi: null,
    divisi: null,
    bagian: null,
    seksi: null,
  });

  const { data: profile, isFetching: profileFetching } = useMaster(
    api,
    [`profile-${state.id}`],
    DETAILENDPOINT.get.profile(state.id),
    {
      select: (res) => {
        const d = res.data;
        const selectDefaults = {};

        Object.entries(SELECT_TITLE_TO_STATE_KEY).forEach(([title, key]) => {
          const prop = PROPERTIES.profile.find(
            (i) => i.title.toLowerCase() === title,
          )?.properties;

          if (prop) selectDefaults[key] = d[prop]?.kode ?? null;
        });

        const dataReduce = Object.keys(d).reduce((acc, key) => {
          if (key === "tanggal_inactive") acc["flag_inactive"] = !!d[key];

          acc[key] = d[key];
          return acc;
        }, {});

        return {
          data: formatDataDetail("profile", dataReduce),
          selectDefaults,
        };
      },
    },
  );

  const { data: masterStatus, isFetching: masterStatusFetching } = useMaster(
    api,
    ["master-status"],
    MASTERENDPOINT.statusKaryawan,
    {
      enabled: isOpen,
      select: (data) => {
        const unique = uniqById(data.data, "stat_karyawan_gp");
        return unique.map((i) => ({
          id: i.kode,
          name: i.stat_karyawan_gp.trim(),
        }));
      },
    },
  );

  const { data: masterUnitKerja, isFetching: masterUnitKerjaFetching } =
    useMaster(api, ["master-lokasi-kerja"], MASTERENDPOINT.lokasiKerja, {
      enabled: isOpen,
    });

  const { data: masterDivisi, isFetching: masterDivisiFetching } = useMaster(
    api,
    ["master-divisi"],
    MASTERENDPOINT.divisi,
    {
      enabled: isOpen,
      select: (data) => {
        const unique = uniqById(data.data, "nama_div");
        return unique.map((i) => ({
          id: i.kode,
          name: i.nama_div,
        }));
      },
    },
  );

  const { data: masterDirektur, isFetching: masterDirekturFetching } =
    useMaster(api, ["master-direktur"], MASTERENDPOINT.direktur, {
      enabled: isOpen,
      select: (data) =>
        data.data
          .map((item) => ({ id: item.kode, name: item.nama_dir }))
          .filter((item) => item.id && item.name),
    });

  const { data: masterDeputi, isFetching: masterDeputiFetching } = useMaster(
    api,
    ["master-deputi"],
    MASTERENDPOINT.deputi,
    {
      enabled: isOpen,
      select: (data) =>
        data.data
          .map((item) => ({ id: item.kode, name: item.nama_dep }))
          .filter((item) => item.id && item.name),
    },
  );

  const { data: masterBagian } = useMaster(
    api,
    ["master-bagian", valueSelect.divisi],
    MASTERENDPOINT.bagian(valueSelect.divisi),
    {
      enabled: isOpen && valueSelect.divisi !== null,
      select: (data) =>
        data.data.map((i) => ({
          id: i.kode_bagian,
          name: i.nama_bag,
        })),
    },
  );

  const { data: masterSeksi } = useMaster(
    api,
    ["master-seksi", valueSelect.bagian],
    MASTERENDPOINT.seksi(valueSelect.bagian),
    {
      enabled: isOpen && valueSelect.bagian !== null,
      select: (data) =>
        data.data.data.map((i) => ({
          id: i.kode,
          name: i.nama_sek,
          uk_id: i.uk_id,
        })),
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

  const { data: masterAgama, isFetching: masterAgamaFetching } = useMaster(
    api,
    ["master-agama"],
    MASTERENDPOINT.agama,
    {
      enabled: isOpen,
      select: (data) => {
        const unique = uniqById(data.data, "agama");
        return unique.map((i) => ({
          id: i.kode_agama,
          name: i.agama,
        }));
      },
    },
  );

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

  const unitKerja = useMemo(() => {
    if (!masterUnitKerja) return [];
    let units = [...masterUnitKerja.data];

    if (valueSelect.direktur)
      units = units.filter((i) => i?.direktur?.id === valueSelect.direktur);

    if (valueSelect.deputi)
      units = units.filter((i) => i?.deputi?.id === valueSelect.deputi);

    if (valueSelect.seksi)
      units = units.filter((i) => i.seksi.id === valueSelect.seksi);

    if (valueSelect.bagian)
      units = units.filter((i) => i.bagian.id === valueSelect.bagian);

    if (valueSelect.divisi)
      units = units.filter((i) => i.divisi.id === valueSelect.divisi);

    return units;
  }, [masterUnitKerja, valueSelect]);

  const isNoneUnitValue = (value) =>
    value === null ||
    value === undefined ||
    value === "" ||
    value === "nnn" ||
    value === "None";

  const resolveUnitKerjaId = (selectedHierarchy) => {
    const allUnits = masterUnitKerja?.data ?? [];
    if (allUnits.length === 0) return null;

    if (selectedHierarchy.seksi) {
      return (
        allUnits.find((item) => item?.seksi?.id === selectedHierarchy.seksi)
          ?.id ?? null
      );
    }

    if (selectedHierarchy.bagian) {
      const bagianLevel =
        allUnits.find(
          (item) =>
            item?.bagian?.id === selectedHierarchy.bagian &&
            isNoneUnitValue(item?.seksi?.id) &&
            isNoneUnitValue(item?.seksi?.nama),
        ) ??
        allUnits.find((item) => item?.bagian?.id === selectedHierarchy.bagian);

      return bagianLevel?.id ?? null;
    }

    if (selectedHierarchy.divisi) {
      const divisiLevel =
        allUnits.find(
          (item) =>
            item?.divisi?.id === selectedHierarchy.divisi &&
            isNoneUnitValue(item?.bagian?.id) &&
            isNoneUnitValue(item?.bagian?.nama) &&
            isNoneUnitValue(item?.seksi?.id) &&
            isNoneUnitValue(item?.seksi?.nama),
        ) ??
        allUnits.find((item) => item?.divisi?.id === selectedHierarchy.divisi);

      return divisiLevel?.id ?? null;
    }

    if (selectedHierarchy.deputi) {
      const deputiLevel =
        allUnits.find(
          (item) =>
            item?.deputi?.id === selectedHierarchy.deputi &&
            isNoneUnitValue(item?.divisi?.id) &&
            isNoneUnitValue(item?.divisi?.nama) &&
            isNoneUnitValue(item?.bagian?.id) &&
            isNoneUnitValue(item?.bagian?.nama) &&
            isNoneUnitValue(item?.seksi?.id) &&
            isNoneUnitValue(item?.seksi?.nama),
        ) ??
        allUnits.find((item) => item?.deputi?.id === selectedHierarchy.deputi);

      return deputiLevel?.id ?? null;
    }

    if (selectedHierarchy.direktur) {
      const direkturLevel =
        allUnits.find(
          (item) =>
            item?.direktur?.id === selectedHierarchy.direktur &&
            isNoneUnitValue(item?.deputi?.id) &&
            isNoneUnitValue(item?.deputi?.nama) &&
            isNoneUnitValue(item?.divisi?.id) &&
            isNoneUnitValue(item?.divisi?.nama) &&
            isNoneUnitValue(item?.bagian?.id) &&
            isNoneUnitValue(item?.bagian?.nama) &&
            isNoneUnitValue(item?.seksi?.id) &&
            isNoneUnitValue(item?.seksi?.nama),
        ) ??
        allUnits.find(
          (item) => item?.direktur?.id === selectedHierarchy.direktur,
        );

      return direkturLevel?.id ?? null;
    }

    return null;
  };

  useEffect(() => {
    if (!profile?.selectDefaults) return;

    const updateValueSelect = { ...valueSelect };

    Object.keys(updateValueSelect).forEach((key) => {
      const findDataProfile = profile.data.find((i) => i.properties === key);

      if (findDataProfile) updateValueSelect[key] = findDataProfile.value;
    });

    setValueSelect((prev) => {
      let changed = false;
      const next = { ...prev };

      for (const [key, val] of Object.entries(profile.selectDefaults)) {
        if (prev[key] !== val) {
          next[key] = val;
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [profile]);

  const master = {
    masterStatus,
    masterDirektur,
    masterDeputi,
    masterDivisi,
    masterSeksi,
    masterMapel,
    masterAgama,
    masterJabatan,
    masterBagian,
  };

  const isLoading =
    profileFetching ||
    masterStatusFetching ||
    masterDirekturFetching ||
    masterDeputiFetching ||
    masterDivisiFetching ||
    masterMapelFetching ||
    masterAgamaFetching ||
    masterJabatanFetching ||
    masterUnitKerjaFetching;

  const profileInput = useMemo(() => {
    const updatedProfile = profile ? { ...profile } : {};

    if (isOpen && !isLoading) {
      updatedProfile.data = updatedProfile.data.map((item) => {
        if (item.form === "select" && item.properties !== "status_nikah") {
          return {
            ...item,
            listSelect: master[item.master],
          };
        }

        return item;
      });
    }
    return updatedProfile;
  }, [isOpen, profile, master, isLoading]);

  const onUpdate = async (value, onClose) => {
    try {
      const selectedHierarchy = { ...valueSelect };
      const profilePayload = {};
      const unitKerjaPayload = {};

      if (Object.keys(value).length === 0) {
        const inactiveField = profile?.data?.find(
          (item) => item.properties === "flag_inactive",
        );
        profilePayload.status_aktif = inactiveField?.value
          ? "Tidak Aktif"
          : "Aktif";
      }

      Object.keys(value).forEach((key) => {
        if (key === "flag_inactive") {
          profilePayload.status_aktif = value[key] ? "Tidak Aktif" : "Aktif";
          if (!value[key]) profilePayload.tanggal_inactive = null;
          return;
        }

        const dataProp = PROPERTIES.profile.find((i) => i.properties === key);
        if (!dataProp) return;

        if (dataProp.master) {
          const findSelected = master[dataProp.master].find(
            (i) => i.name === value[key],
          );

          if (findSelected) {
            if (key === "direktur") {
              selectedHierarchy.direktur = findSelected.id;
              selectedHierarchy.deputi = null;
              selectedHierarchy.divisi = null;
              selectedHierarchy.bagian = null;
              selectedHierarchy.seksi = null;
            } else if (key === "deputi") {
              selectedHierarchy.deputi = findSelected.id;
              selectedHierarchy.divisi = null;
              selectedHierarchy.bagian = null;
              selectedHierarchy.seksi = null;
            } else if (key === "divisi") {
              selectedHierarchy.divisi = findSelected.id;
              selectedHierarchy.bagian = null;
              selectedHierarchy.seksi = null;
            } else if (key === "bagian") {
              selectedHierarchy.bagian = findSelected.id;
              selectedHierarchy.seksi = null;
            } else if (key === "seksi") {
              selectedHierarchy.seksi = findSelected.id;
            } else if (key === "jabatan") {
              unitKerjaPayload.jab_id = findSelected.id;
              return;
            }

            profilePayload[key] = findSelected.id;
          }

          return;
        }

        profilePayload[key] = value[key];
      });

      const changedHierarchy = [
        "direktur",
        "deputi",
        "divisi",
        "bagian",
        "seksi",
      ].some((field) => Object.prototype.hasOwnProperty.call(value, field));

      if (changedHierarchy) {
        const resolvedUnitKerjaId = resolveUnitKerjaId(selectedHierarchy);
        if (resolvedUnitKerjaId) {
          unitKerjaPayload.unit_kerja = resolvedUnitKerjaId;
          delete profilePayload.divisi;
          delete profilePayload.bagian;
          delete profilePayload.seksi;
        }
      } else if (
        Object.prototype.hasOwnProperty.call(unitKerjaPayload, "jab_id")
      ) {
        // Pastikan unit_kerja ikut terkirim saat update jabatan,
        // supaya backend bisa membuat record unit kerja jika belum ada.
        const resolvedUnitKerjaId = resolveUnitKerjaId(selectedHierarchy);
        if (resolvedUnitKerjaId) {
          unitKerjaPayload.unit_kerja = resolvedUnitKerjaId;
        }
      }

      if (Object.keys(unitKerjaPayload).length > 0) {
        const respUnitKerja = await apiService(
          "put",
          api,
          DETAILENDPOINT.update.profileUnitKerja(state.id),
          unitKerjaPayload,
        );

        if (!respUnitKerja.success) throw respUnitKerja;
      }

      if (Object.keys(profilePayload).length > 0) {
        const resp = await apiService(
          "put",
          api,
          DETAILENDPOINT.update.profile(state.id),
          profilePayload,
        );

        if (!resp.success) throw resp;
      }

      queryClient.setQueryData([`profile-${state.id}`], (oldRaw) => {
        if (!oldRaw) return oldRaw;
        const next =
          typeof structuredClone === "function"
            ? structuredClone(oldRaw)
            : JSON.parse(JSON.stringify(oldRaw));

        for (const [path, v] of Object.entries(value)) setByPath(next, path, v);

        return next;
      });

      await queryClient.invalidateQueries({
        queryKey: [`profile-${state.id}`],
      });

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const onSelect = (key, value) => {
    setValueSelect((prev) => {
      const next = { ...prev, [key]: value };

      if (!resetUnits[key]) return next;
      resetUnits[key].forEach((child) => {
        next[child] = null;
      });

      return next;
    });
  };

  if (profileFetching) return <Loading />;

  return (
    <div className="flex flex-col gap-10 flex-1">
      <div className="grid flex-1 grid-cols-5 gap-x-5 gap-y-10">
        {profile.data.map((item) => (
          <div key={item.title}>
            <p className="font-Poppins font-normal opacity-50 text-sm">
              {item.title}
            </p>

            {item.form === "checkbox" ? (
              <Checkbox
                isSelected={item.value}
                isDisabled
                size="md"
                radius="sm"
              />
            ) : (
              <p className="font-Poppins font-medium truncate text-primary">
                {item?.value?.nama ??
                  (typeof item?.value === "string" ? item.value : null) ??
                  "-"}
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        className="bg-[#00000010] rounded-md h-10 flex items-center justify-center w-full"
        onClick={onOpen}
      >
        <i className="fi fi-rr-edit" />
      </button>

      <Modals
        data={profileInput.data}
        title={"Edit Profile"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onUpdate={onUpdate}
        isLoading={isLoading}
        onSelect={onSelect}
        allowSubmitWithoutChange
      />
    </div>
  );
}

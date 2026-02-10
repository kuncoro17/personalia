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
  divisi: "divisi",
  "bagian/biro/sekolah": "bagian",
  seksi: "seksi",
};

const resetUnits = {
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

    if (valueSelect.seksi)
      units = units.filter((i) => i.seksi.id === valueSelect.seksi);

    if (valueSelect.bagian)
      units = units.filter((i) => i.bagian.id === valueSelect.bagian);

    if (valueSelect.divisi)
      units = units.filter((i) => i.divisi.id === valueSelect.divisi);

    return units;
  }, [masterUnitKerja, valueSelect]);

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
    masterDivisiFetching ||
    masterMapelFetching ||
    masterAgamaFetching ||
    masterJabatanFetching;

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
      const dataValue = Object.keys(value).reduce((acc, key) => {
        const dataProp = PROPERTIES.profile.find((i) => i.properties === key);
        if (!dataProp) return acc;

        if (dataProp.master) {
          const findSelected = master[dataProp.master].find(
            (i) => i.name === value[key],
          );

          if (findSelected) {
            if (key === "seksi") {
              acc["unit_kerja"] = findSelected.uk_id;
              return acc;
            }

            acc[key] = findSelected.id;
          }

          return acc;
        }

        acc[key] = value[key];
        return acc;
      }, {});

      const resp = await apiService(
        "put",
        api,
        DETAILENDPOINT.update.profile(state.id),
        dataValue,
      );

      if (!resp.success) throw resp;

      queryClient.setQueryData([`profile-${state.id}`], (oldRaw) => {
        if (!oldRaw) return oldRaw;
        const next =
          typeof structuredClone === "function"
            ? structuredClone(oldRaw)
            : JSON.parse(JSON.stringify(oldRaw));

        for (const [path, v] of Object.entries(value)) setByPath(next, path, v);

        return next;
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
      />
    </div>
  );
}

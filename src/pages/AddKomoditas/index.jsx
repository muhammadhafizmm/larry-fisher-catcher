import "./style.scss";
import { v4 as uuidV4 } from "uuid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import JsonToForm from "json-reactform";
import { addProductDataToList, getProductArea, getProductSize } from "../../service";

import Header from "../../common/Header";
import { toTitleCase } from "../../utils/string";

function AddKomoditas() {
  const [loading, setLoading] = useState(false);
  const [jsonFormModel, setJsonFormModel] = useState({});

  const navigate = useNavigate();
  function handleOnBack() {
    navigate("/");
  }

  async function handleSubmit(params) {
    try {
      const savedPayload = {
        komoditas: params.Komoditas.toUpperCase(),
        price: params.Harga,
        tgl_parsed: new Date().toISOString(),
        timestamp: new Date().getTime().toString(),
        uuid: uuidV4(),
        ...params.Lokasi.value,
        ...params.Berat.value,
      };
      await addProductDataToList(savedPayload).then(() => {
        navigate("/")
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setLoading(true);
    async function fetchOptionsData() {
      await Promise.all([await getProductArea(), await getProductSize()]).then(
        (response) => {
          let sizes = response[1];
          const locations = response[0];

          // remove duplicate value
          sizes = sizes.filter(
            (currentObj, currentIndex, entireArray) =>
              entireArray.findIndex((obj) => obj.size === currentObj.size) ===
              currentIndex
          );
          // sort size
          sizes.sort((prev, next) => parseInt(prev.size) - parseInt(next.size));
          // sort provice
          locations.sort(
            (prev, next) =>
              prev.province &&
              next.province &&
              prev.province.localeCompare(next.province)
          );

          const formattedSize = [];
          const formattedLocation = [];

          sizes.forEach((sizeData) => {
            if (sizeData.size) {
              formattedSize.push({
                value: sizeData,
                label: `${sizeData.size} Kg`,
              });
            }
          });

          locations.forEach((locationData) => {
            if (locationData.province && locationData.city) {
              formattedLocation.push({
                value: {
                  area_kota: locationData.city,
                  area_provinsi: locationData.province,
                },
                label: `${toTitleCase(locationData.province)} - ${toTitleCase(
                  locationData.city
                )}`,
              });
            }
          });

          setJsonFormModel({
            Komoditas: {
              type: "string",
              required: true,
            },
            Lokasi: {
              type: "select",
              required: true,
              options: formattedLocation,
            },
            Berat: {
              type: "select",
              required: true,
              options: formattedSize,
            },
            Harga: {
              type: "number",
              required: true,
            },
            "Tambah Komoditas": {
              type: "submit",
            },
          });
          setLoading(false);
        }
      );
    }
    fetchOptionsData();
  }, []);

  return (
    <>
      <Header title="Tambah Komoditas" handleOnBack={handleOnBack} />
      <div className="add-container">
        {loading && <div className="loader"></div>}
        {!loading && (
          <div className="form-add">
            <JsonToForm model={jsonFormModel} onSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </>
  );
}

export default AddKomoditas;

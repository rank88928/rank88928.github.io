import { get_all_data, get_single_data, get_total_count, add_data, add_customId_data, delete_data, update_data } from "./firebase_api.js";

const path = "product";

async function get_isListed_product_data() {
  let data = await get_all_data(path);
  return data.filter((item) => {
    return item.isListed === true;
  });
}

export { get_isListed_product_data };

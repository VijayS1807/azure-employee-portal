
//hotel
// // api/menu.api.ts
// import axios from 'axios'
// import { MenuResponse } from '../types/menu.types'

// const API_URL = 'https://www.citl.co.in/api'

// export const getMenusApi = async (token: string): Promise<MenuResponse> => {
//     console.log('Fetching menus with token:', token)
//     const username = 'sa'
//     const asTree = true
//     try {
//         const res = await axios.get<MenuResponse>(
//             `${API_URL}/Authentication/GetMenus/${username}/${asTree}`,
//             {
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//                 'X-Tenant-Name': 'CITLDT7'
//             }
//             }
//         )
//         console.log('Menus API response:', res.data)
//         return res.data
//     } catch (error) {
//         console.error('Error fetching menus:', error)
//         throw error
//     }
// }

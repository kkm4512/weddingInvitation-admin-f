import api from './axios'

// 청첩장 CRUD
export const getMcards = () => api.get('/mcards')
export const createMcard = (data) => api.post('/mcards', data)
export const getMcard = (id) => api.get(`/mcards/${id}`)
export const deleteMcard = (id) => api.delete(`/mcards/${id}`)

// 하객 공개 뷰
export const getPublicMcard = (inviteCode) => api.get(`/w/${inviteCode}`)

// 섹션별 GET/PUT
export const getTheme = (id) => api.get(`/mcards/${id}/theme`)
export const putTheme = (id, data) => api.put(`/mcards/${id}/theme`, data)

export const getIntro = (id) => api.get(`/mcards/${id}/intro`)
export const putIntro = (id, data) => api.put(`/mcards/${id}/intro`, data)

export const getCouple = (id) => api.get(`/mcards/${id}/couple`)
export const putCouple = (id, data) => api.put(`/mcards/${id}/couple`, data)

export const getGreeting = (id) => api.get(`/mcards/${id}/greeting`)
export const putGreeting = (id, data) => api.put(`/mcards/${id}/greeting`, data)
export const getGreetingSamples = () => api.get('/greetings/samples')

export const getSchedule = (id) => api.get(`/mcards/${id}/schedule`)
export const putSchedule = (id, data) => api.put(`/mcards/${id}/schedule`, data)

export const getVenue = (id) => api.get(`/mcards/${id}/venue`)
export const putVenue = (id, data) => api.put(`/mcards/${id}/venue`, data)
export const postTransport = (id, data) => api.post(`/mcards/${id}/venue/transports`, data)
export const putTransport = (id, tId, data) => api.put(`/mcards/${id}/venue/transports/${tId}`, data)
export const deleteTransport = (id, tId) => api.delete(`/mcards/${id}/venue/transports/${tId}`)
export const searchAddress = (query) => api.get(`/address/search?query=${encodeURIComponent(query)}`)
export const getMapImage = (lat, lng) => `/api/v1/address/map?lat=${lat}&lng=${lng}&width=400&height=300`

export const getGallery = (id) => api.get(`/mcards/${id}/gallery`)
export const uploadPhoto = (id, file) => {
  const fd = new FormData(); fd.append('file', file)
  return api.post(`/mcards/${id}/gallery`, fd)
}
export const putGalleryOrder = (id, data) => api.put(`/mcards/${id}/gallery/order`, data)
export const deletePhoto = (id, photoId) => api.delete(`/mcards/${id}/gallery/${photoId}`)
export const putGalleryLayout = (id, data) => api.put(`/mcards/${id}/gallery/layout`, data)

export const getContacts = (id) => api.get(`/mcards/${id}/contacts`)
export const putContacts = (id, data) => api.put(`/mcards/${id}/contacts`, data)

export const getAccounts = (id) => api.get(`/mcards/${id}/accounts`)
export const postAccount = (id, data) => api.post(`/mcards/${id}/accounts`, data)
export const putAccount = (id, aId, data) => api.put(`/mcards/${id}/accounts/${aId}`, data)
export const deleteAccount = (id, aId) => api.delete(`/mcards/${id}/accounts/${aId}`)

export const getVideo = (id) => api.get(`/mcards/${id}/video`)
export const putVideo = (id, data) => api.put(`/mcards/${id}/video`, data)

export const getBgm = (id) => api.get(`/mcards/${id}/bgm`)
export const putBgm = (id, data) => api.put(`/mcards/${id}/bgm`, data)
export const uploadBgm = (id, file) => {
  const fd = new FormData(); fd.append('file', file)
  return api.post(`/mcards/${id}/bgm/upload`, fd)
}
export const getBgmSamples = () => api.get('/bgm/samples')

export const getNotices = (id) => api.get(`/mcards/${id}/notices`)
export const postNotice = (id, data) => api.post(`/mcards/${id}/notices`, data)
export const putNotice = (id, nId, data) => api.put(`/mcards/${id}/notices/${nId}`, data)
export const deleteNotice = (id, nId) => api.delete(`/mcards/${id}/notices/${nId}`)

export const getRsvpSettings = (id) => api.get(`/mcards/${id}/rsvp/settings`)
export const putRsvpSettings = (id, data) => api.put(`/mcards/${id}/rsvp/settings`, data)
export const getRsvpList = (id) => api.get(`/mcards/${id}/rsvp`)
export const submitRsvp = (id, data) => api.post(`/mcards/${id}/rsvp`, data)

export const getGuestbookSettings = (id) => api.get(`/mcards/${id}/guestbook/settings`)
export const putGuestbookSettings = (id, data) => api.put(`/mcards/${id}/guestbook/settings`, data)
export const getGuestbook = (id) => api.get(`/mcards/${id}/guestbook`)
export const postGuestbook = (id, data) => api.post(`/mcards/${id}/guestbook`, data)
export const deleteGuestbookMsg = (id, mId) => api.delete(`/mcards/${id}/guestbook/${mId}`)

export const getWreath = (id) => api.get(`/mcards/${id}/wreath`)
export const putWreath = (id, data) => api.put(`/mcards/${id}/wreath`, data)

export const getQuote = (id) => api.get(`/mcards/${id}/quote`)
export const putQuote = (id, data) => api.put(`/mcards/${id}/quote`, data)
export const getQuoteSamples = () => api.get('/quotes/samples')

export const getPhotoQuote = (id) => api.get(`/mcards/${id}/photo-quote`)
export const putPhotoQuote = (id, data) => api.put(`/mcards/${id}/photo-quote`, data)
export const uploadPhotoQuoteImage = (id, file) => {
  const fd = new FormData(); fd.append('file', file)
  return api.post(`/mcards/${id}/photo-quote/upload`, fd)
}

export const getThumbnail = (id) => api.get(`/mcards/${id}/thumbnail`)
export const putThumbnail = (id, data) => api.put(`/mcards/${id}/thumbnail`, data)

export const getSectionOrder = (id) => api.get(`/mcards/${id}/sections/order`)
export const putSectionOrder = (id, data) => api.put(`/mcards/${id}/sections/order`, data)

export const getQrCode = (id) => `/api/v1/mcards/${id}/qrcode`

export const getThemes = () => api.get('/themes')
export const getIntros = () => api.get('/intros')

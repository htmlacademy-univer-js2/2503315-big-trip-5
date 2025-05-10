import {getRandomArrayElement} from '../utils/utils.js';

const offers = [
  {
    'type': 'taxi',
    'offers': [
      {
        'id': '8fa35f2b-9e35-4ef1-aaa2-4ad1197c2f03',
        'title': 'Upgrade to a business class',
        'price': 65
      },
      {
        'id': '58293393-9ddb-4ef1-b404-0d96011e1283',
        'title': 'Choose the radio station',
        'price': 67
      },
      {
        'id': '2e45f5f9-02dc-4777-a89b-8166dbcad643',
        'title': 'Choose temperature',
        'price': 104
      },
      {
        'id': '85f99363-6a9b-4596-bebf-61784b7e4696',
        'title': 'Drive quickly, I\'m in a hurry',
        'price': 55
      },
      {
        'id': '2115cf8b-b082-4ac1-9fdc-a8433f1a59d5',
        'title': 'Drive slowly',
        'price': 186
      }
    ]
  },
  {
    'type': 'bus',
    'offers': [
      {
        'id': '2b7093a4-a080-44cb-a005-c086fbea7537',
        'title': 'Infotainment system',
        'price': 46
      },
      {
        'id': '21432194-f8f5-4131-abb4-472eaa5db3d1',
        'title': 'Order meal',
        'price': 103
      },
      {
        'id': 'd9d8f9dd-1699-481a-b9e4-1d1dddde6fd7',
        'title': 'Choose seats',
        'price': 141
      }
    ]
  },
  {
    'type': 'train',
    'offers': [
      {
        'id': 'e315a33b-73da-4576-95f9-3713289b1730',
        'title': 'Book a taxi at the arrival point',
        'price': 66
      },
      {
        'id': '28f4e3f1-25a1-474f-9ee2-a66a0555ef1e',
        'title': 'Order a breakfast',
        'price': 83
      },
      {
        'id': '4418e4e7-e4ce-45e1-80c8-74acb1aee6ba',
        'title': 'Wake up at a certain time',
        'price': 79
      }
    ]
  },
  {
    'type': 'flight',
    'offers': [
      {
        'id': '7de32439-2d60-4500-940d-7d6a9afeb484',
        'title': 'Choose meal',
        'price': 75
      },
      {
        'id': '717700f3-f2cf-4e25-a570-2eb11bf59794',
        'title': 'Choose seats',
        'price': 160
      },
      {
        'id': '06f89b77-d65e-4598-b652-fb1d880b8e03',
        'title': 'Upgrade to comfort class',
        'price': 143
      },
      {
        'id': '7eb156f4-9e0a-4385-8a72-936026f2cde5',
        'title': 'Upgrade to business class',
        'price': 121
      },
      {
        'id': '2cc790e7-556f-4adf-9bcd-770a1793c2c0',
        'title': 'Add luggage',
        'price': 200
      },
      {
        'id': '7de59165-35f5-4452-a345-756e4423d18d',
        'title': 'Business lounge',
        'price': 32
      }
    ]
  },
  {
    'type': 'check-in',
    'offers': [
      {
        'id': '0de0b698-ed14-4f9b-b40e-95bc8b1803e7',
        'title': 'Choose the time of check-in',
        'price': 146
      },
      {
        'id': 'd5e4cce3-4db5-4044-965a-245aba9cd4ad',
        'title': 'Choose the time of check-out',
        'price': 64
      },
      {
        'id': '252b5dea-80eb-4be1-a52a-3b2e4abb1598',
        'title': 'Add breakfast',
        'price': 158
      },
      {
        'id': '9887344d-3da1-40cf-a155-0d6013c407c4',
        'title': 'Laundry',
        'price': 186
      },
      {
        'id': '8ecdfed9-a233-48de-b011-38d95b0d09a2',
        'title': 'Order a meal from the restaurant',
        'price': 70
      }
    ]
  },
  {
    'type': 'sightseeing',
    'offers': []
  },
  {
    'type': 'ship',
    'offers': [
      {
        'id': '92dc83f6-a763-4cee-af08-0cd989250a58',
        'title': 'Choose meal',
        'price': 53
      },
      {
        'id': 'f639c780-f6c2-419d-addf-e230a9d5ebfa',
        'title': 'Choose seats',
        'price': 182
      },
      {
        'id': '863df192-a58a-47b9-87ed-9e90aa3dacf6',
        'title': 'Upgrade to comfort class',
        'price': 89
      },
      {
        'id': '5bc01488-1be5-417b-b169-7eda0b39a084',
        'title': 'Upgrade to business class',
        'price': 115
      },
      {
        'id': '26ee0e55-2c66-439b-b291-9c78627cef34',
        'title': 'Add luggage',
        'price': 166
      },
      {
        'id': '57c12d05-fd69-4d3e-9227-eaf96b1ec69f',
        'title': 'Business lounge',
        'price': 193
      }
    ]
  },
  {
    'type': 'drive',
    'offers': [
      {
        'id': '6bff3f07-470c-444a-863a-e28973f3089f',
        'title': 'With automatic transmission',
        'price': 64
      },
      {
        'id': 'f801d1f0-69c2-42a9-b48d-42375f83dd82',
        'title': 'With air conditioning',
        'price': 96
      }
    ]
  },
  {
    'type': 'restaurant',
    'offers': [
      {
        'id': 'f5522e8f-77a5-4aa2-b49b-13d53fbbfd0f',
        'title': 'Choose live music',
        'price': 192
      },
      {
        'id': '3ec7f435-fe54-4262-8ed7-447184927917',
        'title': 'Choose VIP area',
        'price': 182
      }
    ]
  }
];

const EVENT_TYPES = offers.map((item) => item.type);
const getAllOffers = () => offers;
const getRandomOfferType = () => getRandomArrayElement(offers).type;
const getAllOffersByType = (type) => offers.find((item) => item.type === type).offers.map((offer) => offer.id);
const getOfferById = (id) => {
  for (let i = 0; i < offers.length; i++) {
    const foundOffer = offers[i].offers.find((offer) => offer.id === id);
    if (foundOffer) {
      return foundOffer;
    }
  }
};

export { getRandomOfferType, EVENT_TYPES, getAllOffersByType, getOfferById, getAllOffers };

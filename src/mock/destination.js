import {getRandomArrayElement} from '../utils/utils.js';

const destinations = [
  {
    'id': '47006fca-a4ec-4c23-bb97-6f08c43abac2',
    'description': '',
    'name': 'Den Haag',
    'pictures': []
  },
  {
    'id': '19702d07-9e4c-4a92-9efd-9ac111d2ea71',
    'description': '',
    'name': 'Helsinki',
    'pictures': []
  },
  {
    'id': '7ab719cb-c384-4254-8374-d8aeb6dcfe45',
    'description': 'Valencia - a true asian pearl',
    'name': 'Valencia',
    'pictures': [
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/1.jpg',
        'description': 'Valencia in a middle of Europe'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/17.jpg',
        'description': 'Valencia middle-eastern paradise'
      }
    ]
  },
  {
    'id': '64ba5ef4-708a-4787-b1f7-086a5759fee2',
    'description': 'Vien - middle-eastern paradise',
    'name': 'Vien',
    'pictures': [
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/14.jpg',
        'description': 'Vien for those who value comfort and coziness'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/2.jpg',
        'description': 'Vien famous for its crowded street markets with the best street food in Asia'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/8.jpg',
        'description': 'Vien is a beautiful city'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/7.jpg',
        'description': 'Vien with a beautiful old town'
      }
    ]
  },
  {
    'id': 'a79889bd-7230-439d-bf53-d87173817261',
    'description': 'Geneva - middle-eastern paradise',
    'name': 'Geneva',
    'pictures': []
  },
  {
    'id': '598bd2dd-f2fb-4208-bb59-59ec443c56bf',
    'description': 'Naples - with crowded streets',
    'name': 'Naples',
    'pictures': [
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/14.jpg',
        'description': 'Naples with crowded streets'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/14.jpg',
        'description': 'Naples a true asian pearl'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/5.jpg',
        'description': 'Naples in a middle of Europe'
      }
    ]
  },
  {
    'id': '7bdb2851-ba05-4800-9a74-2e1048eae6e8',
    'description': 'Nagasaki - for those who value comfort and coziness',
    'name': 'Nagasaki',
    'pictures': [
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/11.jpg',
        'description': 'Nagasaki for those who value comfort and coziness'
      }
    ]
  },
  {
    'id': '051784f6-84f5-4a5a-a9bc-24d71058e3f1',
    'description': 'Chamonix - with a beautiful old town',
    'name': 'Chamonix',
    'pictures': [
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/8.jpg',
        'description': 'Chamonix with an embankment of a mighty river as a centre of attraction'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/10.jpg',
        'description': 'Chamonix a perfect place to stay with a family'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/3.jpg',
        'description': 'Chamonix a true asian pearl'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/7.jpg',
        'description': 'Chamonix with an embankment of a mighty river as a centre of attraction'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/3.jpg',
        'description': 'Chamonix a true asian pearl'
      }
    ]
  },
  {
    'id': 'cf9162f6-739b-4029-8f41-204ae002820f',
    'description': 'Monaco - a true asian pearl',
    'name': 'Monaco',
    'pictures': [
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/1.jpg',
        'description': 'Monaco a perfect place to stay with a family'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/9.jpg',
        'description': 'Monaco with crowded streets'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/20.jpg',
        'description': 'Monaco a perfect place to stay with a family'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/3.jpg',
        'description': 'Monaco middle-eastern paradise'
      }
    ]
  },
  {
    'id': 'a6fdad58-b352-4f3b-9289-badf1f37dbc1',
    'description': 'Kioto - full of of cozy canteens where you can try the best coffee in the Middle East',
    'name': 'Kioto',
    'pictures': [
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/3.jpg',
        'description': 'Kioto for those who value comfort and coziness'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/20.jpg',
        'description': 'Kioto with a beautiful old town'
      },
      {
        'src': 'https://24.objects.htmlacademy.pro/static/destinations/12.jpg',
        'description': 'Kioto middle-eastern paradise'
      }
    ]
  }
];

const CITIES = destinations.map((destination) => destination.name);

const getRandomDestinationId = () => getRandomArrayElement(destinations).id;

const getAllDestinations = () => destinations;

export {getRandomDestinationId, CITIES, getAllDestinations};

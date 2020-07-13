var config = {
  style: 'mapbox://styles/vkwetzel/ckckuafso01a31hnxwc0q7tmi',
  accessToken:
    'pk.eyJ1Ijoidmt3ZXR6ZWwiLCJhIjoiY2swNzNzamw3MDB6azNtcGVvN3cxNTJzZSJ9.YY56WOsc0ZNIK9YTwosnTw',
  showMarkers: false,
  theme: 'dark',
  alignment: 'left',
  title: 'HURRICANE DORIAN',
  // subtitle: 'x can i just remove this',
  //byline: 'can i remove this too',
  // footer: 'Source: source citations, etc.',
  chapters: [
    {
      id: 'impact',
      title: 'IMPACT',
      image:
        'https://www.aljazeera.com/mritems/imagecache/mbdxxlarge/mritems/Images/2019/9/5/273967f357594b9b8dbfb469e3d7146c_18.jpg',
      description:
        'Hurricane Dorian, Category 5, was one of the most intense storms ever to hit the Caribbean. (Aljazeera)',
      location: {
        center: [-80.1918, 25.7617],
        zoom: 3.5,
        pitch: 60,
        bearing: -43.2
      },
      onChapterEnter: [],
      onChapterExit: []
    },
    {
      id: 'bahamas',
      title: 'THE BAHAMAS',
      //image: './path/to/image/source.png',
      description:
        'The Abaco Islands were the most severely affected. An estimated 90 percent of housing and infrastructure was damaged or destroyed. The most impacted areas were primarily inhabited by vulnerable, undocumented migrant populations. In Grand Bahama, satellite data suggests that 76 to 100 percent of buildings in some areas were destroyed. (Mercy Corps)',
      location: {
        center: [-77.308, 27.4465],
        zoom: 6.0,
        pitch: 60,
        bearing: 19.2
      },
      onChapterEnter: [],
      onChapterExit: []
    },
    {
      id: 'florida',
      title: 'FLORIDA',
      // image: './path/to/image/source.png',
      description:
        'Hurricane Dorian largely spared Florida, but the storm still brought winds, rain and storm surge. (Miami Herald)',
      location: {
        center: [-80.593, 28.571],
        zoom: 6.53,
        pitch: 60,
        bearing: -13.6
      },
      onChapterEnter: [],
      onChapterExit: []
    },
    {
      id: 'veer',
      title: 'VEERING EASTWARD',
      // image: './path/to/image/source.png',
      description: 'Dorian hugged the eastern US coastline and ...',
      location: {
        center: [-80.749, 31.669],
        zoom: 7.6,
        pitch: 60,
        bearing: 52.8
      },
      onChapterEnter: [],
      onChapterExit: []
    },
    {
      id: 'east-coast',
      //title: 'East Coast',
      // image: './path/to/image/source.png',
      description:
        '.... made landfall over Cape Hatteras, North Carolina as a Category 1 storm before continuing north and eventually disipating.',
      location: {
        center: [-76.289, 32.517],
        zoom: 5.5,
        pitch: 60,
        bearing: 20.7
      },
      onChapterEnter: [],
      onChapterExit: []
    }
  ]
};

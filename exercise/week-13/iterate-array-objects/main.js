const artists = [
    {
      name: "Kerry James Marshall",
      birth_date: "October 17, 1955",
      birth_place: "Birmingham, Alabama",
      works: [
        {
          title: "Past Times",
          year: 1997,
          medium: "acrylic and collage on unstretched canvas",
          image:
            "https://www.culturetype.com/wp-content/uploads/2016/05/MarshallKerryJames_PastTimes_v03.jpg"
        }
      ]
    },
    {
      name: "Lorraine O'Grady",
      birth_date: "September 21, 1934",
      birth_place: "Boston, Massachusetts",
      works: [
        {
          title: "Art Is...",
          year: 1983,
          medium: "photo-installation",
          image:
            "https://studiomuseum.imgix.net/images/ogrady_troupe_mbn_1983_20093_web_2023-09-14-133019_kzaw.jpg"
        }
      ]
    },
    {
      name: "Senga Nengudi",
      birth_date: "September 18, 1943",
      birth_place: "Chicago, Illinois",
      works: [
        {
          title: "Performance Piece",
          year: 1978,
          medium: "Black and white photographs",
          image:
            "https://news.artnet.com/app/news-upload/2018/07/Senga-Nengudi.-Performance-Piece-1978..jpg"
        }
      ]
    },
    {
      name: "David Hammons",
      birth_date: "July 24, 1943",
      birth_place: "Springfield, Illinois",
      works: [
        {
          title: "Oh say can you see",
          year: 2017,
          medium: "Dyed cotton fabric",
          image:
            "https://media.newyorker.com/photos/5ddeba2aa19b0b0008568c0a/master/pass/191209_r35505.jpg"
        }
      ]
    },
    {
      name: "Mark Bradford",
      birth_date: "November 20, 1961",
      birth_place: "Los Angeles, California",
      works: [
        {
          title: "Black Venus",
          year: 2005,
          medium: "mixed media collage",
          image:
            "https://www.theparisreview.org/blog/wp-content/uploads/2019/07/black-venus-1.jpg"
        }
      ]
    }
  ];
  
  // outside the loop
  const artist_container = document.querySelector(".artist-container");
  const input = document.querySelector("input");
  const filter_button = document.querySelector(".filter-button");
  const search_button = document.querySelector(".search-button");
  const sidebar = document.querySelector(".sidebar");
  
  //---------- RENDER DATA
  
  function renderAllArtists(data) {
    data.forEach(function (artist) {
      let img_container = document.createElement("div");
      let artist_img = document.createElement("img");
  
      let image = artist.works[0]["image"];
  
      img_container.classList.add("image-container");
      artist_img.setAttribute("src", image);
  
      img_container.appendChild(artist_img);
      artist_container.appendChild(img_container);
    });
  }
  
  renderAllArtists(artists);
  
  //---------- SEARCH DATA
  function searchArtists(artist) {
    artists.filter((el) => el === artist.name);
  }
  
  function getInputVal(event) {
    event.preventDefault();
    let artist = input.value;
    console.log(artist);
    searchArtists(artist);
  }
  
  //---------- FILTER DATA
  
  function filterArtists() {
    artist_container.innerHTML = "";
    console.log("clicked", artists);
  
    let filtered = [];
  
    for (let i = 0; i < artists.length; i++) {
      if (artists[i].name == "Mark Bradford") {
        filtered.push(artists[i]);
      }
    }
  
    console.log(filtered);
    renderAllArtists(filtered);
  }
  
  function openMenu(e) {
    e.preventDefault();
    console.log("open menu on click");
    sidebar.classList.toggle("active");
  }
  
  // filter_button.addEventListener("click", openMenu);
  search_button.addEventListener("click", getInputVal);
  
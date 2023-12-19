<template>
  <div class="d-flex flex-column mx-4">
    <vue-navigation-bar
      :options="navbarOptions"
      @vnb-item-clicked="vnbItemClicked"
    >
    </vue-navigation-bar>
  </div>
  <router-view />
</template>

<script>

export default {

  name: "GC Tools",

  // Make sure we return a function for data!
  data: function () {
    return {
      
      navbarOptions: {
        elementId: "main-navbar",
        isUsingVueRouter: true,
        mobileBreakpoint: 1050,
        brandImagePath: "./",
        brandImage: "gctlogo.png",
        brandImageAltText: "GC Tools",
        collapseButtonOpenColor: "#2c3e50",
        collapseButtonCloseColor: "#2c3e50",
        showBrandImageInMobilePopup: true,
        ariaLabelMainNav: "Main Navigation",
        tooltipAnimationType: "shift-away",
        tooltipPlacement: "bottom",
        menuOptionsLeft: [
          {
            type: "link",
            text: this.$t("menu.coordinates"),
            arrowColor: "#722727",
            subMenuOptions: [
              {
                type: "link",
                text: this.$t("coordinates.convert.title"),
                path: { name: "CoordConvert" },
              },
              {
                type: "link",
                text: this.$t("coordinates.project.title"),
                path: { name: "CoordProj" },
              },
              {
                type: "link",
                text: this.$t("coordinates.mapmaker.title"),
                path: { name: "MapMaker" },
              },
              {
                type: "link",
                text: this.$t("coordinates.incomplete.title"),
                path: { name: "CoordIncomplete" },
              },
              {
                type: "link",
                text: this.$t("coordinates.lines.title"),
                path: { name: "CoordLines" },
              },
              {
                type: "link",
                text: this.$t("coordinates.triangles.title"),
                path: { name: "CoordTriangles" },
              },
              {
                type: "link",
                text: this.$t("coordinates.circles.title"),
                path: { name: "CoordCircles" },
              },
              {
                type: "link",
                text: this.$t("coordinates.antipode.title"),
                path: { name: "CoordAntipode" },
              },
              {
                type: "link",
                text: this.$t("coordinates.w3w.title"),
                path: { name: "CoordW3W" },
              },
              {
                type: "link",
                text: this.$t("coordinates.revwherigo.title"),
                path: { name: "ReverseWherigo" },
              }
            ],
          },
          {
            type: "link",
            text: this.$t("menu.texttools"),
            arrowColor: "#722727",
            subMenuOptions: [
              {
                type: "link",
                text: this.$t("texttools.wordvalue.title"),
                path: { name: "WordValue" },
              },
              {
                type: "link",
                text: this.$t("texttools.charcodes.title"),
                path: { name: "TextCodes" },
              },
              {
                type: "link",
                text: this.$t("texttools.smartreplace.title"),
                path: { name: "SmartReplace" },
              },
              {
                type: "link",
                text: this.$t("texttools.analyze.title"),
                path: { name: "TextAnalyzer" },
              },
              {
                type: "link",
                text: this.$t("texttools.texttonumbers.title"),
                path: { name: "TextToNumbers" },
              },
              {
                type: "link",
                text: this.$t("texttools.keyboards.title"),
                path: { name: "Keyboards" },
              },
              {
                type: "link",
                text: this.$t("texttools.texttoss.title"),
                path: { name: "TextToss" },
              },
              {
                type: "link",
                text: this.$t("numerology.title"),
                path: { name: "Numerology" },
              },            
            ],
          },
          {
            type: "link",
            text: this.$t("menu.codes"),
            arrowColor: "#722727",
            subMenuOptions: [
              {
                type: "link",
                text: this.$t("menu.ciphers"),
                path: { name: "Cipher" }
              },                    
              {
                type: "link",
                text: this.$t("rotciphers.title"),
                path: { name: "RotCipher"}
              },                    
              {
                type: "link",
                text: this.$t("codes.codebook.title"),
                path: { name: "Codebook" },
              },
              {
                type: "link",
                text: this.$t("codes.fonts.title"),
                path: { name: "Fonts" },
              },
              {
                type: "link",
                text: this.$t("codes.segment.title"),
                path: { name: "Segment" },
              },
              {
                type: "link",
                text: this.$t("codes.resistorcode.title"),
                path: { name: "Resistor" },
              },
              {
                type: "link",
                text: this.$t("codes.decabit.title"),
                path: { name: "DecaBit" },
              },
              {
                type: "link",
                text: this.$t("freqanal.title"),
                path: { name: "FreqAnal" },
              },
            ],
          },
          {
            type: "link",
            text: this.$t("menu.imagetools"),
            arrowColor: "#722727",
            subMenuOptions: [
              {
                type: "link",
                text: this.$t("imagetools.exifscanner.title"),
                path: { name: "ExifScanner" },
              },
              {
                type: "link",
                text: this.$t("imagetools.colorpicker.title"),
                path: { name: "ColorPicker" },
              },
              {
                type: "link",
                text: this.$t("imagetools.filltool.title"),
                path: { name: "FillTool" },
              },
              {
                type: "link",
                text: this.$t("imagetools.pixeldata.title"),
                path: { name: "PixelData" },
              },
              {
                type: "link",
                text: this.$t("imagetools.pixelbuild.title"),
                path: { name: "PixelBuild" },
              },
              {
                type: "link",
                text: this.$t("imagetools.imagetransform.title"),
                path: { name: "ImageTransform" },
              },
              {
                type: "link",
                text: this.$t("imagetools.textextractor.title"),
                path: { name: "TextExtractor" },
              }
            ],
          },
          {
            type: "link",
            text: this.$t("menu.mathtools"),
            arrowColor: "#722727",
            subMenuOptions: [
              {
                type: "link",
                text: this.$t("mathtools.baseconvert.title"),
                path: { name: "BaseConvertor" },
              },
              {
                type: "link",
                text: this.$t("mathtools.decimals.title"),
                path: { name: "Digits" },
              },
              {
                type: "link",
                text: this.$t("mathtools.primes.title"),
                path: { name: "Primes" },
              },
              {
                type: "link",
                text: this.$t("mathtools.romans.title"),
                path: { name: "Romans" },
              },
              {
                type: "link",
                text: this.$t("mathtools.fibonacci.title"),
                path: { name: "Fibonacci" },
              },
              {
                type: "link",
                text: this.$t("mathtools.primegcdlcm.title"),
                path: { name: "GCDAndLCM" },
              },
              {
                type: "link",
                text: this.$t("mathtools.formulasolver.title"),
                path: { name: "FormulaSolver" },
              },
              {
                type: "link",
                text: this.$t("mathtools.numberprop.title"),
                path: { name: "NumberProperties" },
              },
              {
                type: "link",
                text: this.$t("mathtools.bignum.title"),
                path: { name: "BigNumbers" },
              },
              {
                type: "link",
                text: this.$t("mathtools.nimbers.title"),
                path: { name: "Nimbers" },
              },
              {
                type: "link",
                text: this.$t("mathtools.sequences.title"),
                path: { name: "Sequences" },
              },
              {
                type: "link",
                text: this.$t("mathtools.palindrome.title"),
                path: { name: "Palindrome" },
              },
            ],
          },
          {
            type: "link",
            text: this.$t("menu.comptools"),
            arrowColor: "#722727",
            subMenuOptions: [
              {
                type: "link",
                text: this.$t("comptools.compbintotext.title"),
                path: { name: "compbintotext" },
              },
              {
                type: "link",
                text: this.$t("comptools.compbcd.title"),
                path: { name: "bcd" },
              },
              {
                type: "link",
                text: this.$t("comptools.encryption.title"),
                path: { name: "encryption" },
              },
              {
                type: "link",
                text: this.$t("comptools.hashes.title"),
                path: { name: "hashes" },
              },
              {
                type: "link",
                text: this.$t("comptools.compbrainfuck.title"),
                path: { name: "brainfuck" },
              },
              {
                type: "link",
                text: this.$t("comptools.cow.title"),
                path: { name: "cow" },
              },
              {
                type: "link",
                text: this.$t("comptools.beatnik.title"),
                path: { name: "beatnik" },
              },
              {
                type: "link",
                text: this.$t("comptools.compdeadfish.title"),
                path: { name: "deadfish" },
              },
              {
                type: "link",
                text: this.$t("comptools.duckspeak.title"),
                path: { name: "duckspeak" },
              },
              {
                type: "link",
                text: this.$t("comptools.checksum.title"),
                path: { name: "checksum" },
              }
            ],
          },
          {
            type: "link",
            text: this.$t("menu.other"),
            arrowColor: "#722727",
            subMenuOptions: [
            {
                type: "link",
                text: this.$t("printlog.title"),
                path: { name: "PrintLog"}
              },                    
              {
                type: "link",
                text: this.$t("menu.htmlscanner"),
                path: { name: "HtmlParser"}
              },                    
              {
                type: "link",
                text: this.$t("othertools.sudokusolver.title"),
                path: { name: "SudokuSolver" },
              },
              {
                type: "link",
                text: this.$t("othertools.mmsolver.title"),
                path: { name: "MastermindSolver" },
              },
              {
                type: "link",
                text: this.$t("othertools.unitconvertor.title"),
                path: { name: "UnitConvertor" },
              },
              {
                type: "link",
                text: this.$t("datecalc.title"),
                path: { name: "DateCalc" },
              },
              {
                type: "link",
                text: this.$t("randomizer.title"),
                path: { name: "Randomizer" },
              },
              {
                type: "link",
                text: this.$t("othertools.periodictable.title"),
                path: { name: "PeriodicTable" },
              },
              {
                type: "link",
                text: this.$t("othertools.countries.title"),
                path: { name: "CountriesAll" },
              },
              {
                type: "link",
                text: this.$t("othertools.usastates.title"),
                path: { name: "UsaStates" },
              },
              {
                type: "link",
                text: this.$t("othertools.countryregions.title"),
                path: { name: "CountryRegions" },
              },
              {
                type: "link",
                text: this.$t("othertools.dnacode.title"),
                path: { name: "DNACode" },
              },
              {
                type: "link",
                text: this.$t("gameoflife.title"),
                path: { name: "GameOfLife" },
              },
              {
                type: "link",
                text: this.$t("booksearch.title"),
                path: { name: "BookSearch" },
              },
            ],
          },
          {
            type: "link",
            text: this.$t("menu.help"),
            arrowColor: "#722727",
            subMenuOptions: [
              {
                type: "link",
                text: this.$t("menu.howto"),
                path: { name: "HowTo"}
              },  
              {
                type: "link",
                text: this.$t("labels.help") + this.$t("menu.coordinates"),
                path: { name: "HelpCoord"}
              },  
              {
                type: "link",
                text: this.$t("labels.help") + this.$t("menu.texttools"),
                path: { name: "HelpText"}
              },  
              {
                type: "link",
                text: this.$t("labels.help") + this.$t("menu.codes"),
                path: { name: "HelpCodes"}
              },  
              {
                type: "link",
                text: this.$t("labels.help") + this.$t("menu.imagetools"),
                path: { name: "HelpImage"}
              },  
              {
                type: "link",
                text: this.$t("labels.help") + this.$t("menu.mathtools"),
                path: { name: "HelpMath"}
              },  
              {
                type: "link",
                text: this.$t("labels.help") + this.$t("menu.comptools"),
                path: { name: "HelpComp"}
              },  
              {
                type: "link",
                text: this.$t("labels.help") + this.$t("menu.other"),
                path: { name: "HelpOther"}
              },  
              {
                type: "link",
                text: this.$t("menu.about"),
                path: { name: "About"}
              },  
            ]
          }              
        ],
        menuOptionsRight: [
          {
            type: 'button',
            text: '',
            path: { name: 'AllTools' },
            iconRight: '<i class="fa-solid fa-search"></i>',
          },
          {
            isLinkAction: true,
            type: "button",
            text: "NL",
          },
          {
            isLinkAction: true,
            type: "button",
            text: "EN",
          },
        ],
      },
    };
  },

  methods: {

    translateMenu: function () {
      this.navbarOptions.menuOptionsLeft[0].text = this.$t("menu.coordinates");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[0].text = this.$t("coordinates.convert.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[1].text = this.$t("coordinates.project.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[2].text = this.$t("coordinates.mapmaker.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[3].text = this.$t("coordinates.incomplete.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[4].text = this.$t("coordinates.lines.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[5].text = this.$t("coordinates.triangles.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[6].text = this.$t("coordinates.circles.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[7].text = this.$t("coordinates.antipode.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[8].text = this.$t("coordinates.w3w.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[9].text = this.$t("coordinates.revwherigo.title");
      this.navbarOptions.menuOptionsLeft[1].text = this.$t("menu.texttools");
      this.navbarOptions.menuOptionsLeft[1].subMenuOptions[0].text = this.$t("texttools.wordvalue.title");
      this.navbarOptions.menuOptionsLeft[1].subMenuOptions[1].text = this.$t("texttools.charcodes.title");
      this.navbarOptions.menuOptionsLeft[1].subMenuOptions[2].text = this.$t("texttools.smartreplace.title");
      this.navbarOptions.menuOptionsLeft[1].subMenuOptions[3].text = this.$t("texttools.analyze.title");
      this.navbarOptions.menuOptionsLeft[1].subMenuOptions[4].text = this.$t("texttools.texttonumbers.title");
      this.navbarOptions.menuOptionsLeft[1].subMenuOptions[5].text = this.$t("texttools.keyboards.title");
      this.navbarOptions.menuOptionsLeft[1].subMenuOptions[6].text = this.$t("texttools.texttoss.title");
      this.navbarOptions.menuOptionsLeft[1].subMenuOptions[7].text = this.$t("numerology.title");
      this.navbarOptions.menuOptionsLeft[2].text = this.$t("menu.codes");
      this.navbarOptions.menuOptionsLeft[2].subMenuOptions[0].text = this.$t("menu.ciphers");
      this.navbarOptions.menuOptionsLeft[2].subMenuOptions[1].text = this.$t("rotciphers.title");
      this.navbarOptions.menuOptionsLeft[2].subMenuOptions[2].text = this.$t("codes.codebook.title");
      this.navbarOptions.menuOptionsLeft[2].subMenuOptions[3].text = this.$t("codes.fonts.title");
      this.navbarOptions.menuOptionsLeft[2].subMenuOptions[4].text = this.$t("codes.segment.title");
      this.navbarOptions.menuOptionsLeft[2].subMenuOptions[5].text = this.$t("codes.resistorcode.title");
      this.navbarOptions.menuOptionsLeft[2].subMenuOptions[6].text = this.$t("codes.decabit.title");
      this.navbarOptions.menuOptionsLeft[2].subMenuOptions[7].text = this.$t("freqanal.title");
      this.navbarOptions.menuOptionsLeft[3].text = this.$t("menu.imagetools");
      this.navbarOptions.menuOptionsLeft[3].subMenuOptions[0].text = this.$t("imagetools.exifscanner.title");
      this.navbarOptions.menuOptionsLeft[3].subMenuOptions[1].text = this.$t("imagetools.colorpicker.title");
      this.navbarOptions.menuOptionsLeft[3].subMenuOptions[2].text = this.$t("imagetools.filltool.title");
      this.navbarOptions.menuOptionsLeft[3].subMenuOptions[3].text = this.$t("imagetools.pixeldata.title");
      this.navbarOptions.menuOptionsLeft[3].subMenuOptions[4].text = this.$t("imagetools.pixelbuild.title");
      this.navbarOptions.menuOptionsLeft[3].subMenuOptions[5].text = this.$t("imagetools.imagetransform.title");
      this.navbarOptions.menuOptionsLeft[3].subMenuOptions[6].text = this.$t("imagetools.textextractor.title");
      this.navbarOptions.menuOptionsLeft[4].text = this.$t("menu.mathtools");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[0].text = this.$t("mathtools.baseconvert.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[1].text = this.$t("mathtools.decimals.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[2].text = this.$t("mathtools.primes.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[3].text = this.$t("mathtools.romans.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[4].text = this.$t("mathtools.fibonacci.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[5].text = this.$t("mathtools.primegcdlcm.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[6].text = this.$t("mathtools.formulasolver.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[7].text = this.$t("mathtools.numberprop.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[8].text = this.$t("mathtools.bignum.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[9].text = this.$t("mathtools.nimbers.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[10].text = this.$t("mathtools.sequences.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[11].text = this.$t("mathtools.palindrome.title");
      this.navbarOptions.menuOptionsLeft[5].text = this.$t("menu.comptools");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[0].text = this.$t("comptools.compbintotext.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[1].text = this.$t("comptools.compbcd.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[2].text = this.$t("comptools.encryption.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[3].text = this.$t("comptools.hashes.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[4].text = this.$t("comptools.compbrainfuck.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[5].text = this.$t("comptools.cow.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[6].text = this.$t("comptools.beatnik.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[7].text = this.$t("comptools.compdeadfish.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[8].text = this.$t("comptools.duckspeak.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[9].text = this.$t("comptools.checksum.title");
      this.navbarOptions.menuOptionsLeft[6].text = this.$t("menu.other");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[0].text = this.$t("printlog.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[1].text = this.$t("menu.htmlscanner");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[2].text = this.$t("othertools.sudokusolver.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[3].text = this.$t("othertools.mmsolver.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[4].text = this.$t("othertools.unitconvertor.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[5].text = this.$t("datecalc.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[6].text = this.$t("randomizer.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[7].text = this.$t("othertools.periodictable.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[8].text = this.$t("othertools.countries.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[9].text = this.$t("othertools.usastates.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[10].text = this.$t("othertools.countryregions.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[11].text = this.$t("othertools.dnacode.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[12].text = this.$t("gameoflife.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[13].text = this.$t("booksearch.title");
      this.navbarOptions.menuOptionsLeft[7].text = this.$t("menu.help");
      this.navbarOptions.menuOptionsLeft[7].subMenuOptions[0].text = this.$t("menu.howto");
      this.navbarOptions.menuOptionsLeft[7].subMenuOptions[1].text = this.$t("labels.help") + this.$t("menu.coordinates");
      this.navbarOptions.menuOptionsLeft[7].subMenuOptions[2].text = this.$t("labels.help") + this.$t("menu.texttools");
      this.navbarOptions.menuOptionsLeft[7].subMenuOptions[3].text = this.$t("labels.help") + this.$t("menu.codes");
      this.navbarOptions.menuOptionsLeft[7].subMenuOptions[4].text = this.$t("labels.help") + this.$t("menu.imagetools");
      this.navbarOptions.menuOptionsLeft[7].subMenuOptions[5].text = this.$t("labels.help") + this.$t("menu.mathtools");
      this.navbarOptions.menuOptionsLeft[7].subMenuOptions[6].text = this.$t("labels.help") + this.$t("menu.comptools");
      this.navbarOptions.menuOptionsLeft[7].subMenuOptions[7].text = this.$t("labels.help") + this.$t("menu.other");
      this.navbarOptions.menuOptionsLeft[7].subMenuOptions[8].text = this.$t("menu.about");
    },

    vnbItemClicked: function (text) {
      if (text === "NL") {
        this.$i18n.locale = "nl";
        this.translateMenu();
      }
      if (text === "EN") {
        this.$i18n.locale = "en";
        this.translateMenu();
      }
    }

  },
};

</script>

<style>
</style>

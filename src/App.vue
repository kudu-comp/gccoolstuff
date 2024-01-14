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
                text: this.$t("convert.title"),
                path: { name: "Convert" },
              },
              {
                type: "link",
                text: this.$t("project.title"),
                path: { name: "Project" },
              },
              {
                type: "link",
                text: this.$t("mapmaker.title"),
                path: { name: "MapMaker" },
              },
              {
                type: "link",
                text: this.$t("incomplete.title"),
                path: { name: "Incomplete" },
              },
              {
                type: "link",
                text: this.$t("lines.title"),
                path: { name: "Lines" },
              },
              {
                type: "link",
                text: this.$t("triangles.title"),
                path: { name: "Triangles" },
              },
              {
                type: "link",
                text: this.$t("circles.title"),
                path: { name: "Circles" },
              },
              {
                type: "link",
                text: this.$t("antipode.title"),
                path: { name: "Antipode" },
              },
              {
                type: "link",
                text: this.$t("w3w.title"),
                path: { name: "W3W" },
              },
              {
                type: "link",
                text: this.$t("revwherigo.title"),
                path: { name: "RevWherigo" },
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
                text: this.$t("wordvalue.title"),
                path: { name: "WordValue" },
              },
              {
                type: "link",
                text: this.$t("charcodes.title"),
                path: { name: "CharCodes" },
              },
              {
                type: "link",
                text: this.$t("analtxt.title"),
                path: { name: "AnalTxt" },
              },
              {
                type: "link",
                text: this.$t("texttonum.title"),
                path: { name: "TextToNum" },
              },
              {
                type: "link",
                text: this.$t("keyboards.title"),
                path: { name: "Keyboards" },
              },
              {
                type: "link",
                text: this.$t("texttoss.title"),
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
                text: this.$t("ciphers.title"),
                path: { name: "Ciphers" }
              },
              {
                type: "link",
                text: this.$t("rotciphers.title"),
                path: { name: "RotCiphers"}
              },                    
              {
                type: "link",
                text: this.$t("substcipher.title"),
                path: { name: "SubstCipher" },
              },
              {
                type: "link",
                text: this.$t("codebook.title"),
                path: { name: "Codebook" },
              },
              {
                type: "link",
                text: this.$t("fonts.title"),
                path: { name: "Fonts" },
              },
              {
                type: "link",
                text: this.$t("segment.title"),
                path: { name: "Segment" },
              },
              {
                type: "link",
                text: this.$t("resistorcode.title"),
                path: { name: "Resistor" },
              },
              {
                type: "link",
                text: this.$t("decabit.title"),
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
                text: this.$t("exifscanner.title"),
                path: { name: "ExifScanner" },
              },
              {
                type: "link",
                text: this.$t("colorpicker.title"),
                path: { name: "ColorPicker" },
              },
              {
                type: "link",
                text: this.$t("filltool.title"),
                path: { name: "FillTool" },
              },
              {
                type: "link",
                text: this.$t("pixeldata.title"),
                path: { name: "PixelData" },
              },
              {
                type: "link",
                text: this.$t("pixelbuild.title"),
                path: { name: "PixelBuild" },
              },
              {
                type: "link",
                text: this.$t("imagetransform.title"),
                path: { name: "ImageTransform" },
              },
              {
                type: "link",
                text: this.$t("textextractor.title"),
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
                text: this.$t("baseconv.title"),
                path: { name: "BaseConv" },
              },
              {
                type: "link",
                text: this.$t("decimals.title"),
                path: { name: "Digits" },
              },
              {
                type: "link",
                text: this.$t("primes.title"),
                path: { name: "Primes" },
              },
              {
                type: "link",
                text: this.$t("romans.title"),
                path: { name: "Romans" },
              },
              {
                type: "link",
                text: this.$t("fibonacci.title"),
                path: { name: "Fibonacci" },
              },
              {
                type: "link",
                text: this.$t("primegcdlcm.title"),
                path: { name: "GCDAndLCM" },
              },
              {
                type: "link",
                text: this.$t("formulasolver.title"),
                path: { name: "FormulaSolver" },
              },
              {
                type: "link",
                text: this.$t("numberprop.title"),
                path: { name: "NumberProp" },
              },
              {
                type: "link",
                text: this.$t("bignumbers.title"),
                path: { name: "BigNumbers" },
              },
              {
                type: "link",
                text: this.$t("nimbers.title"),
                path: { name: "Nimbers" },
              },
              {
                type: "link",
                text: this.$t("sequences.title"),
                path: { name: "Sequences" },
              },
              {
                type: "link",
                text: this.$t("palindrome.title"),
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
                text: this.$t("bintotext.title"),
                path: { name: "bintotext" },
              },
              {
                type: "link",
                text: this.$t("bcd.title"),
                path: { name: "bcd" },
              },
              {
                type: "link",
                text: this.$t("encryption.title"),
                path: { name: "encryption" },
              },
              {
                type: "link",
                text: this.$t("hashes.title"),
                path: { name: "hashes" },
              },
              {
                type: "link",
                text: this.$t("brainfuck.title"),
                path: { name: "brainfuck" },
              },
              {
                type: "link",
                text: this.$t("cow.title"),
                path: { name: "cow" },
              },
              {
                type: "link",
                text: this.$t("beatnik.title"),
                path: { name: "beatnik" },
              },
              {
                type: "link",
                text: this.$t("deadfish.title"),
                path: { name: "deadfish" },
              },
              {
                type: "link",
                text: this.$t("duckspeak.title"),
                path: { name: "duckspeak" },
              },
              {
                type: "link",
                text: this.$t("checksum.title"),
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
                text: this.$t("htmlscanner.title"),
                path: { name: "HtmlParser"}
              },                    
              {
                type: "link",
                text: this.$t("sudokusolv.title"),
                path: { name: "SudokuSolv" },
              },
              {
                type: "link",
                text: this.$t("mmsolver.title"),
                path: { name: "MMSolver" },
              },
              {
                type: "link",
                text: this.$t("unitconvertor.title"),
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
                text: this.$t("periodictable.title"),
                path: { name: "PeriodicTable" },
              },
              {
                type: "link",
                text: this.$t("countries.title"),
                path: { name: "Countries" },
              },
              {
                type: "link",
                text: this.$t("usastates.title"),
                path: { name: "UsaStates" },
              },
              {
                type: "link",
                text: this.$t("regions.title"),
                path: { name: "Regions" },
              },
              {
                type: "link",
                text: this.$t("dnacode.title"),
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
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[0].text = this.$t("convert.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[1].text = this.$t("project.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[2].text = this.$t("mapmaker.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[3].text = this.$t("incomplete.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[4].text = this.$t("lines.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[5].text = this.$t("triangles.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[6].text = this.$t("circles.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[7].text = this.$t("antipode.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[8].text = this.$t("w3w.title");
      this.navbarOptions.menuOptionsLeft[0].subMenuOptions[9].text = this.$t("revwherigo.title");
      this.navbarOptions.menuOptionsLeft[1].text = this.$t("menu.texttools");
      this.navbarOptions.menuOptionsLeft[1].subMenuOptions[0].text = this.$t("wordvalue.title");
      this.navbarOptions.menuOptionsLeft[1].subMenuOptions[1].text = this.$t("charcodes.title");
      this.navbarOptions.menuOptionsLeft[1].subMenuOptions[2].text = this.$t("analtxt.title");
      this.navbarOptions.menuOptionsLeft[1].subMenuOptions[3].text = this.$t("texttonum.title");
      this.navbarOptions.menuOptionsLeft[1].subMenuOptions[4].text = this.$t("keyboards.title");
      this.navbarOptions.menuOptionsLeft[1].subMenuOptions[5].text = this.$t("texttoss.title");
      this.navbarOptions.menuOptionsLeft[1].subMenuOptions[6].text = this.$t("numerology.title");
      this.navbarOptions.menuOptionsLeft[2].text = this.$t("menu.codes");
      this.navbarOptions.menuOptionsLeft[2].subMenuOptions[0].text = this.$t("ciphers.title");
      this.navbarOptions.menuOptionsLeft[2].subMenuOptions[1].text = this.$t("rotciphers.title");
      this.navbarOptions.menuOptionsLeft[2].subMenuOptions[2].text = this.$t("substcipher.title");
      this.navbarOptions.menuOptionsLeft[2].subMenuOptions[3].text = this.$t("codebook.title");
      this.navbarOptions.menuOptionsLeft[2].subMenuOptions[4].text = this.$t("fonts.title");
      this.navbarOptions.menuOptionsLeft[2].subMenuOptions[5].text = this.$t("segment.title");
      this.navbarOptions.menuOptionsLeft[2].subMenuOptions[6].text = this.$t("resistorcode.title");
      this.navbarOptions.menuOptionsLeft[2].subMenuOptions[7].text = this.$t("decabit.title");
      this.navbarOptions.menuOptionsLeft[2].subMenuOptions[8].text = this.$t("freqanal.title");
      this.navbarOptions.menuOptionsLeft[3].text = this.$t("menu.imagetools");
      this.navbarOptions.menuOptionsLeft[3].subMenuOptions[0].text = this.$t("exifscanner.title");
      this.navbarOptions.menuOptionsLeft[3].subMenuOptions[1].text = this.$t("colorpicker.title");
      this.navbarOptions.menuOptionsLeft[3].subMenuOptions[2].text = this.$t("filltool.title");
      this.navbarOptions.menuOptionsLeft[3].subMenuOptions[3].text = this.$t("pixeldata.title");
      this.navbarOptions.menuOptionsLeft[3].subMenuOptions[4].text = this.$t("pixelbuild.title");
      this.navbarOptions.menuOptionsLeft[3].subMenuOptions[5].text = this.$t("imagetransform.title");
      this.navbarOptions.menuOptionsLeft[3].subMenuOptions[6].text = this.$t("textextractor.title");
      this.navbarOptions.menuOptionsLeft[4].text = this.$t("menu.mathtools");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[0].text = this.$t("baseconv.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[1].text = this.$t("decimals.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[2].text = this.$t("primes.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[3].text = this.$t("romans.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[4].text = this.$t("fibonacci.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[5].text = this.$t("primegcdlcm.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[6].text = this.$t("formulasolver.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[7].text = this.$t("numberprop.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[8].text = this.$t("bignumbers.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[9].text = this.$t("nimbers.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[10].text = this.$t("sequences.title");
      this.navbarOptions.menuOptionsLeft[4].subMenuOptions[11].text = this.$t("palindrome.title");
      this.navbarOptions.menuOptionsLeft[5].text = this.$t("menu.comptools");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[0].text = this.$t("bintotext.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[1].text = this.$t("bcd.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[2].text = this.$t("encryption.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[3].text = this.$t("hashes.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[4].text = this.$t("brainfuck.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[5].text = this.$t("cow.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[6].text = this.$t("beatnik.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[7].text = this.$t("deadfish.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[8].text = this.$t("duckspeak.title");
      this.navbarOptions.menuOptionsLeft[5].subMenuOptions[9].text = this.$t("checksum.title");
      this.navbarOptions.menuOptionsLeft[6].text = this.$t("menu.other");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[0].text = this.$t("printlog.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[1].text = this.$t("htmlscanner.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[2].text = this.$t("sudokusolv.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[3].text = this.$t("mmsolver.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[4].text = this.$t("unitconvertor.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[5].text = this.$t("datecalc.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[6].text = this.$t("randomizer.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[7].text = this.$t("periodictable.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[8].text = this.$t("countries.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[9].text = this.$t("usastates.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[10].text = this.$t("regions.title");
      this.navbarOptions.menuOptionsLeft[6].subMenuOptions[11].text = this.$t("dnacode.title");
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

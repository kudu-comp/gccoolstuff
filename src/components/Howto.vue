<template>
  <div class="container">
    <div class="sectionhead">
      <div class="text-center">How to solve mystery caches</div>
    </div>
    <div class="mainpage">
      <div class="infoblock">
        {{$t('dialoghowto.info')}}
      </div>
      <div class="flex-row mb-2">
        <input type="button" id="collapseall" name="collapseall" value="Collapse All" class="btn btn-primary mr-2" v-on:click="collapseAll">
        <input type="button" id="expandall" name="expandall" value="Expand All" class="btn btn-primary mr-2" v-on:click="expandAll">
      </div>
      <va-item v-bind:showitem='show[0]' v-on:toggle='toggleItem(0)'>
        <template v-slot:header>Getting Started</template>
        <template v-slot:content>
          <p>Solving mystery caches can be very simple and almost impossible. It's best to get started with the simple ones. They would have a low D-rating.
          Most of the mysteries out there tend to be in this category. No matter how easy or difficult the puzzle your always have to find the coordinates
          in one way or the other, directly or indirectly.</p>
          To solve the puzzle there are a few basic steps
          <ol>
            <li>Locate the puzzle. In most cases this is rather obvious. There are a couple of questions you have to answer in the listing.
              There is a link to a jigsaw puzzle you must solve.</li>
            <li>Look for hints. Often there are hints to help you solve the puzzle. The first step are the Hints on the geocache page.</li>
            <li>Solve the puzzle. Easier said then done. But in quite a few cases you just need to Google a lot or solve an online jigsaw or crossword puzzle.</li>
            <li>Check your solution. These days most geocaches come with the standard geocaching.com checker.</li>
            <li>Update the coordinates of the cache. Click the pencil after the posted coordinates. From now on the map will show the posted
              coordinates and if you use the Geocaching App it will also show and navigate to the solved coordinates.
            </li>
          </ol>
          You might want to read the Essential Skills before you start: Word Values, Binary Numbers, Codebooks. It is also useful to know
          a little bit about coordinates. With these skills you can probably solve 80% of all the mystery caches.
        </template>
      </va-item>
      <va-item v-bind:showitem='show[1]' v-on:toggle='toggleItem(1)'>
        <template v-slot:header>Find the puzzle &amp; find hints</template>
        <template v-slot:content>
          <p>Geocaching HQ rules are clear. A mystery cache must contain all the info you need to solve it. But where to look?</p>
          <ul>
            <li><b>Cache description</b> - is there anything unusual about the text. Are there typing errors? Are there bold, italic, colored letters?
              Is there a link that you can click?
            </li>
            <li><b>Images</b> - images might contain a lot of info. First look carefully at the image. Click it to see what happens. Try to zoom in as
              much as possible and see if the image reveals unseen details. Images might also contain additional information, called EXIF data. Save the
              image on your computer and use <router-link to="/imagetools">Image tools</router-link> to search for EXIF data.
            </li>
            <li><b>Gallery</b> - scroll to the very first images in the Gallery. The cache owner might have added an image here with some info.
            </li>
            <li><b>Waypoints</b> - the cache owner might have added waypoints. The description might contain some info.
            </li>
            <li><b>Cache title</b> - the title of the cache might be useful. It could be an anagram for example. Try to google the title.
            </li>
            <li><b>Cache owner</b> - a cache owner can use a different name. It could be an anagram for example. Try to google the name. (You
              will know if the name is changed by pressing contact the cache owner; it will revail the CO's real name).
            </li>
            <li><b>Background image</b> - a geocache might have a background image. Try all of the image tricks for the background image.
            </li>
            <li><b>Hidden information</b> - try select all (Ctrl-A) on the webpage and see what happens. There might be white text, that becomes
              visible. But there might also be information hidden inside the HTML (e.g. comments, 1x1 pixel links and more). Try
              <router-link to="/html">HTML scanner</router-link> and see if it can find this hidden information.
            </li>
          </ul>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[2]' v-on:toggle='toggleItem(2)'>
        <template v-slot:header>Checkers</template>
        <template v-slot:content>
          <p>There are a couple of different checkers, each with its own behaviour.</p>
          <ul>
            <li><b>Geocaching.com </b> - checker is pretty obvious, it is the one on the cache page. It automatically updates the
              coordinates if the checker is green.</li>
            <li><b>Geocheck</b> - checker is an external checker. If the coordinate is correct it might reveal additional information
              such as the real coordinates.
            </li>
            <li><b>Certitude</b> - checker does not only accept coordinates, it also accepts text or numbers. Click the checker to see
              what you are looking for. If the answer is correct it might reveal additional info about the cache location.
            </li>
            <li><b>Other</b> - checkers. There are a few others. Just click the checker and see what happens (even if you don't know
              the solution yet).
            </li>
            <li><b>Maps</b>. When there is no checker it's always a good idea to check your coordinates with <a href="https://maps.google.com">
              Google Maps</a> or with <a href="https://openstreetmap.org">Open Streetmaps</a>. Just type the coordinate in WGS84 format in the
              search box. Check to see if the location looks okay.
            </li>
          </ul>
          Brute force use of the checker is limited to 10 attempts per 10 minutes, which means that if you miss parts of the
          checker you can try a few options. It's not cheating everybody does it!
        </template>
      </va-item>
      <va-item v-bind:showitem='show[3]' v-on:toggle='toggleItem(3)'>
        <template v-slot:header>Essential skill: Word value and square root</template>
        <template v-slot:content>
          <p>You have a geocache where you have to answer some questions. The questions give you the values for A, B, C and so on. And with these
          letters you can calculate the coordinate, e.g. N52 23.ABC E004 38.DEF. But how do you get from an answer to a number. Using word value
          and square root does the trick.</p>
          An example:
          <ul>
            <li>Who's the famous spy known as 007?</li>
            <li>The answer (after a lot of Google) is James Bond</li>
            <li>Calculating the word value is adding the value of each letter (with A=1 and Z=26). So James Bond = 10+1+13+5+... = 83.</li>
            <li>Calculating the square root is done by adding to the numbers, till there is one left. So James Bond = 83 = 8+3 = 11 = 1+1 = 2.</li>
          </ul>
          There are lots of alternatives where the values of A-Z differ, e.g. the Scrabble values, A=0-Z=25 or Z=26-A=1. All of these are available
          in the tool <router-link to="/text/textwordvalue">Word value &amp; square root</router-link>. Saving you all the hard work.
        </template>
      </va-item>
      <va-item v-bind:showitem='show[4]' v-on:toggle='toggleItem(4)'>
        <template v-slot:header>Essential skill: Binary numbers</template>
        <template v-slot:content>
          <p>You don't need to know the math of binary numbers (although it can help). Basically binary numbers are a combination of 0's and 1's. To
          use them in geocaches you have to convert them to normal (decimal) numbers. For example:</p>
          <ul>
            <li>The cache listing shows 0101 0010 0001 1001 0000 0011 0100</li>
            <li>The zeroes and ones are a clear indication of a possible binary code</li>
            <li>The are seven groups, which hints at a coordinate</li>
            <li>Conversion to decimal with <router-link to="/math/baseconvertor">Base converter</router-link> reveals 5219034</li>
            <li>The posted cache coordinates for this mystery were N52 18.666, which is clearly close to the solution.</li>
          </ul>
          <p>Often binary numbers are not written using 0 and 1, but with alternatives like - and +, - and o. If you see a puzzle with lots of two
          different symbols, the chances are pretty big it's a binary code. Binary codes might also be hidden in an image as dots and hyphens (or
          whatever the CO thought off). For example:</p>
          <ul>
            <li>The cache listing shows --+-+ ---+- ----+ -+--+ ----- ---++ --+--</li>
            <li>As there are only two symbols used, this might be a binary number.</li>
            <li>Use <router-link to="/math/baseconvertor">Base converter</router-link> replacing -+ with 01 reveals 5219034.</li>
          </ul>
          <p>But sometimes you don't need to convert. In these cases putting the numbers on separate lines might reveal a pattern. For example:</p>
          <div style="font-family: monospace; margin-left: 20px">
            01110 01110 01110<br>
            01000 00010 00010<br>
            01110 00010 01110<br>
            00010 00010 00010<br>
            01110 00010 01110<br>
          </div>
          <p>reads 573</p>
          <p>On rare occassions the use of just two symbols could also indicate the Bacon cipher (see Ciphers), it might indicate a
          telegraph (Baudot) code (see Text &amp; codes) or it could be a Gray Code (see Ciphers).</p>
        </template>
      </va-item>
      <va-item v-model:showitem='show[5]' v-on:toggle='toggleItem(5)'>
        <template v-slot:header>Essential skill: Codebooks</template>
        <template v-slot:content>
          <p>Geocachers seem to have a weak spot for obscure codes. Codes used in video games, TV series, movies, books, ancient manuscripts
          or weird fonts all have found there way into geoaches. The cache listing would show a couple of weird looking symbols. There
          might be a few, just representing the numbers or there might be a huge text. After solving mystery caches for a while you will
          recognize the most common ones, but even after years of solving mysteries I still see codebooks unknown to me.</p>
          <p>The best place to start is <router-link to="/codebook">Code book</router-link>. You can search the name and description with
          and/or you can select one of the tags. If there is a hint in the text about the
          possible origin of the code you can use it to search. You can also search on what the code looks like e.g. squares, dots,
          script, curves. This will limit your options and save you the struggle of going through over a 100 codebooks.</p>
          If the code is not here, there are a few other options:
          <ul>
            <li>Try some other geocache tool websites</li>
            <li>Make a snapshot of one or a few symbols and try Google image search</li>
            <li>If the text is long enough replace all the symbols with letters a to z and crack the code using substituion
              using <router-link to="/text/smartreplace">Smart replace</router-link>.</li>
          </ul>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[6]' v-on:toggle='toggleItem(6)'>
        <template v-slot:header>Coordinates</template>
        <template v-slot:content>
          <p>You are always looking for coordinates. The only exception is the Certitude checker in which case you might look for strings or numbers.
          But coordinates come in many different versions and formats. So it might not be so straightforward.</p>
          <p><strong>WGS84</strong> is the most widely used. Coordinates are specified in latitude (distance to the equator) and
          longitude (distance to the 0-meridian).Latitudes range from -90 to +90 degrees or W90 to E90. Longitudes range from
          -180 to 180 degrees, or S180 to N180. There are many ways to write WGS84 coordinates,  with decimal degrees, decimal
          minutes or decimal seconds, e.g. N52 27.131 E4 38.505 or 52.4443 -4.455444.</p>
          <p>Alternatively the coordinate you are looking for might be in another format. In most of these cases you will need to use
          <router-link to="/coord/coordconvert">Coordinate Convertor</router-link> to convert to WGS before you can pass it through a checker.</p>
          <ul>
            <li><strong>Grids</strong> use x and y, were x is the offset in E/W (the longitude) and y is the offset in N/S (the latitude).
              The grid coordinate has a different format, e.g. Dutch Grid looks like 116904 493820 and British Grid like TL 92293 85189.
            </li>
            <li><strong>UTM or Universal Transverse Mercator</strong> looks like 31U 624215 5810530. The first number is the zone.
              UTM divides longitude in zones of 6 degrees. The letter designates the latitude area. The second number is the easting
              (or latitude). The third number is northing (or longitude).
            </li>
            <li><strong>Maidenhead locator</strong> looks JO22jk93fj96. The first two characters are always uppercase and then there are
              altenating pairs of numbers and lowercase characters. The length is between 8 and 14 characters. The Maidenhead locator is
              used by radio amateurs and is effectivly a hash of the WGS84 coordinate. It is easily recognized by its format.
            </li>
            <li><strong>Geohash</strong> looks like u176mbdzy6v. A string of numbers and lowercase letters with a length of 8 to 14
              characters. It is a hash of the WGS84 format. Just try the convertor and see if it turns up valid coordinate.
            </li>
            <li><strong>Open Location Code </strong> looks like 9F46CRJG+8RV. The + sign is a good indication this might be an open location code.
              Be aware that the first 4 letters/digits are commonly omitted. Instead the name of a location (e.g. Amsterdam) will be used as a
              reference. In that case go to the posted coordinates on Google Maps and search the Open Location Code. Google will show the location.
            </li>
            <li><strong>Geohash36</strong> looks like B8K7gtVl8l2. It is rarely used. Just try the convertor and see if it turns up valid coordinate.
            </li>
          </ul>
          <p>One tool that is used quite often is the projection of coordinates. Given the starting point the new location is a certain
            distance and angle away. Use <router-link to="/coord/coordproj">Project a coordinate</router-link>.</p>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[7]' v-on:toggle='toggleItem(7)'>
        <template v-slot:header>I got a bunch of random numbers...</template>
        <template v-slot:content>
          <p>There are quite a few possibilities to make sense out of a bunch of random numbers. Here are a few options</p>
          <ul>
            <li><b>Binary</b>. If you see just 0 and 1 you're likely dealing with some kind of binary code. Try <router-link to="/math/baseconvertor">
              Base converter</router-link>. It might also be a slightly different binary code. Try <router-link to="/comptools/compbcd">
              Binary Coded Decimals</router-link>. Or try to convert to ASCII using <router-link to="/comp/charcodes">Character codes</router-link></li>
            <li><b>Decimal</b>. If you see the numbers 0 to 9 it's decimal. Try to convert to ASCII using <router-link to="/comp/charcodes">
              Character codes</router-link>. Or try <router-link to="/comp/compbintotext">{{$t('comptools.compbintotext.title')}}
              </router-link> with the input set to decimal.</li>
            <li><b>Hexadecimal</b>. If you see 0 to 9 and A to Z it's hexadecimal. Try to convert to ASCII using <router-link to="/comp/charcodes">
              Character codes</router-link>. Or try <router-link to="/comp/compbintotext">{{$t('comptools.compbintotext.title')}}
              </router-link> with the input set to hexadecimal. Or it might be a hash. Try <router-link to="/comp/hashes">
              {{$t('comptools.hashes.title')}}</router-link></li>
            <li><b>UTF or ASCII</b>. The numbers are the numbers used by the computer internally (also known as ASCII, UTF,
              codepages or alt codes). There are many different options here. The input could be decimal, but also binary or
              hexadecimal. The used codepage could be one of many. With <router-link to="/text/textcodes">Character &amp; codes</router-link>
              you can quickly try all the options.
            </li>
            <li><b>Base conversion</b>. The numbers are specified in a different base. The maximum digit might indicate the base
              that was used. E.g. a maximum digit of 4, might be base 5 (or higher). Use <router-link to="/math/baseconvertor">Base
              converter</router-link> and try.
            </li>
            <li><b>Text to numbers</b>. The values of the letters are written one after the other. A leading zero might or might
              not be included. E.g. 011812 read ARM. You can use <router-link to="/text/texttonumbers">Text to numbers</router-link>
              to crack the code.
            </li>
            <li><b>ROT5</b>. Actually a cipher with all the digits shifted 5 positions. Use <router-link :to="{ name: 'Cipher',
              params: { cipher: 'ROT5' }}">ROT5</router-link> to solve or just calculate it yourself.</li>
            <li><b>Polybius</b>. A cipher that encodes digrams in to numbers between 11 and 55. use <router-link :to="{ name: 'Cipher',
              params: { cipher: 'Polybius' }}">Polybius</router-link> to solve.</li>
            <li><b>Vanity code</b>. The numbers represent letters on the keyboard of your phone, e.g. 2 is a, 22 is b, 333 is f.</li>
            <li><b>Base conversion using letters</b>. The cache owner has translated the text using Base 26 with values A-Z to base 10
              with digits 0-9. This is pretty rare, but you can easily convert it using <router-link to="/math/baseconvertor">Base
              converter</router-link>.
            </li>
            <p>If none of this works please let me know!</p>
          </ul>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[8]' v-on:toggle='toggleItem(8)'>
        <template v-slot:header>I got a bunch of random letters...</template>
        <template v-slot:content>
          <p>This can get quite complicated but there are a few easy ones you should try first</p>
          <ul>
            <li><b>ROT13</b> - the alphabet has shifted 13 postions. Use <router-link :to="{ name: 'Cipher', params: { cipher: 'ROT13'}}">ROT13</router-link>
              to solve the puzzle. This is also the one geocaching.com uses to show/hide the hints.
            </li>
            <li><b>Caesar</b> - the alphabet has shifted a few positions. Use <router-link :to="{ name: 'Cipher', params: { cipher: 'Caesar'}}">Caesar</router-link>
              to solve the puzzle.
            </li>
            <li><b>Analyze</b> the text using <router-link to="/text/textanalyzer">Analyzer</router-link>. The coordinate might be
              hidden in the number of words, lines, certain letters.</li>
            <li><b>Keyboards</b> - the text was typed as if it where another keyboard (like Dvorak or Colemak). You can use
              <router-link to="/text/textkeyboards">Keyboards</router-link> to solve these puzzles.</li>
            <li><b>Anagrams</b> - the text might be an anagram. There are a few good anagram solvers on the internet, but none are perfect. So you
              might be on your own here. My favorite is the <a href="http://wordsmith.org/anagram/advanced.html">Internet Anagram Server</a></li>
            <li><b>Acronyms</b> - The letters might stand for chemical elements <router-link to="/other/periodictable">(Periodic table)</router-link> or
              <router-link to="/other/countries">Countries</router-link> or maybe <router-link to="/other/usastates">US States</router-link>.</li>
            <li><b>Substitution cipher</b> replaces each letter with one or more other
              letters/digits/symbols. The best way to crack a substitution cipher is the <router-link to="/text/smartreplace">Smart replace</router-link>
              tool. It will analyze frequencies in the encoded text and suggest possible replacements. It works really well for larger texts,
              but with a bit of trial and error even with small texts most codes are easily broken.</li>
          </ul>
          <p>If the easy ones fail there is a big chance you're dealing with a more complicated cipher. Solving ciphers is an art on its
            own and you might want to read the topic on Ciphers. There are over 50 different <router-link to="/cipher">Ciphers</router-link> that
            can be encoded or decoded with this website. But the real difficult part is to figure out the key(s). Look for hints to find the key and use this tool
            to try all possible options</p>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[9]' v-on:toggle='toggleItem(9)'>
        <template v-slot:header>I got a bunch of symbols...</template>
        <template v-slot:content>
          Again there are many possibilities. Try these ones:
          <ul>
            <li><b>Codebook</b> - search the <router-link to="/codes/codebook">Code book</router-link> to see if there is a match.</li>
            <li><b>Special fonts</b> - or try <router-link to="/codes/fonts">Special fonts</router-link> to see if there is a match.</li>
            <li><b>Encoded text</b> - the text is binary encoded using <router-link to="/comp/compbintotext">{{$t('comptools.compbintotext.title')}}</router-link>
              In these cases the text is likely a combination of symbols, letters and digits.</li>
            <li><b>Computer codes</b> - symbols might convert to numbers, or might convert to letters when using a different codepage.
              With <router-link to="/text/textcodes">Character &amp; codes</router-link> you can quickly try all the options.</li>
            <li><b>Cyrillic or Greek letters</b> - are actually normal text. The tools <router-link to="/text/textcodes">Character &amp; codes</router-link>
              and <router-link to="/text/textkeyboards">Keyboards</router-link> support Cyrillic and Greek.</li>
            <li><b>Brainfuck</b> - the text has a lot of + and some -&gt;&lt;[],. Use <router-link to="/comp/compbrainfuck">{{$t('comptools.compbrainfuck.title')}}
              </router-link> to solve the code.</li>
            <li><b>Decabit</b> - if you see a lot of + and - you might be looking at <router-link to="/codes/decabit">{{$t('codes.decabit.title')}}
              </router-link></li>
            <li><b>Goldbug cipher</b> - uses 52-†81346,709*‡.$();?¶]¢:[ and can be solved <router-link :to="{ name: 'Cipher',
              params: { cipher: 'Goldbug'}}">here</router-link>.</li>
            <li><b>Another cipher</b> - use <router-link to="/text/smartreplace">Smart replace</router-link> to see if the frequencies
              are similar to those of natural language. If so, you can use the tool to find the right replacements.</li>
            <li><b>Hashed text</b> - hashes are used for example to encrypt passwords. They are normally hexadecimal and would use the numbers 0 to 9 and A to F.
              The coded hash can not be converted back to the original text. The only way to solve it is trying all options and find the one that matches. 
              You can try your luck with <router-link to="/comp/hashes">{{$t('comptools.hashes.title')}}
              </router-link></li>
            <li><b>Geohash</b> - read the topic on coordinates to recognize geohashes.</li>
          </ul>
          <p>If none of this works, please let me know!</p>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[10]' v-on:toggle='toggleItem(10)'>
        <template v-slot:header>I got a bunch of colors...</template>
        <template v-slot:content>
          Some options to try:
          <ul>
            <li><b>Resistor code</b> - you can find it the <router-link to="/other/resistorcode">Resistor code</router-link> here.</li>
            <li><b>Color codes</b> - again go to the <router-link to="/codebook">Code book</router-link> and search for colors.</li>
            <li><b>RGB Values</b> - Red, Green and Blue values are used by the computer to generate all the colors on your screen. If you
              have an image with just a few colors, you might want to check the RGB values of each of the colors. It is easily done with
              the <router-link to="/images/colorpicker">Colorpicker</router-link></li>
            <li><b>Other color values</b> - Instead of RGB could be coded with CMYK, HSV or hexadecimally. These values are also available 
            in the <router-link to="/images/colorpicker">Colorpicker</router-link></li>
          </ul>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[11]' v-on:toggle='toggleItem(11)'>
        <template v-slot:header>I only got an image...</template>
        <template v-slot:content>
          The art of hiding information in an image can become really complex. The easy ones to try first are:
          <ul>
            <li><b>Barcode or QR code</b> - the image is a Barcode or QR code. There are many different formats. My favorite online
              tool for cracking barcodes is the <a href="https://online-barcode-reader.inliteresearch.com/">Inlite Free Barcode reader</a>.</li>
            <li><b>Image information</b> - also called EXIF data. <router-link to="/images/exifscanner">Image tools</router-link> will retrieve this info. Not
              only look at the text fields, but also the dimensions and a possible GPS location in the image.</li>
            <li><b>Fill areas</b> - if colors are really close the human eye cannot see the difference. For example a red area might be red text
              on a slightly different red background. Use <router-link to="/images/filltool">Color Editor</router-link> to reveal those messages.</li>
            <li><b>Zoom in</b> extremely and see what the image reveales.</li>
            <li><b>Links</b> - there might be links attached to the image (or just to 1 pixel actually). Use <router-link to="/html">HTML scanner</router-link>
              to find these links</li>
            <li><b>Statistics</b> - get some statistics on the image, the number of pixels of each color, the sum of R, G and B values and so on.
              The code might be hidden somewhere in these stats. Try <router-link to="/images/pixeldata">Pixel Data</router-link>.</li>
          </ul>
          <p><b>Steganography</b> - is the art of encrypting a message within an image. There are many different ways. Data might be hidden
          in unused bits (try LSB or Least Significant Bits), it might be hidden using color depth (try to reduce color depth using an
          image tool). There also techniques that require a key to be solved (look for image steganography to find online tools)</p>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[12]' v-on:toggle='toggleItem(12)'>
        <template v-slot:header>Incomplete coordinates</template>
        <template v-slot:content>
          <p>After all the hard work you still might not have been able to get the entire coordinate. There might be one or two or more
          digits missing. You can quickly plot the options using <router-link to="/coord/coordincomplete">Incomplete coordinates</router-link>.
          Combine this with info about the cache (terrain rating, attributes, hint) and find the most likely options. Also keep in mind that
          the cache must be within 1600m of the posted coordinates.</p>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[13]' v-on:toggle='toggleItem(13)'>
        <template v-slot:header>I still have no clue</template>
        <template v-slot:content>
          <p>If nothing helps there is always the art of elimination. First keep in mind that the cache must be within 3200m (2mi) of the posted
          coordinates (but mostly they are closer to the posted coordinates). And geocaches need to be 160m (or 0.1mi) away from each other.
          Especially in geocache dense areas this limits the number of options. So if you draw circles around each known geocache (including the mysteries
          you already solved) within roughly a 6km radius of the posted coordinates, the possible locations are revealed. Use
          <router-link to="/coord/coordmapmaker">Map maker</router-link>. Combine
          this with info about the cache (Terrain rating and attributes) to reduce possible options further. Finally the hint might contain
          useful info about the cache location (e.g. sit down) that could also be used.</p>
          <p>You probably will not get exactly the right coordinate (and a green checker) but it might be good enough to go out there and
          give it a try.</p>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[14]' v-on:toggle='toggleItem(14)'>
        <template v-slot:header>Ciphers</template>
        <template v-slot:content>
          All ciphers use a couple of basic techniques:
          <ul>
            <li><b>Monoalphabetic substitution</b> replaces the letters (or anything else) in the original message with one or more other letters (or
              anything else). Monoalphabetic means only one alphabet is used for all replacements. This make the cipher easy to crack using
              frequency analysis. A well known example is <router-link :to="{ name: 'Cipher', params: { cipher: 'ROT13'}}">ROT13</router-link></li>
            <li><b>Polyalphabetic subsitution</b> uses different alphabets. This makes the cipher more difficult to break, as one letter has more
              than one on replacement. The more alphabets are being used, the more difficult it is to break the code. But if the number is too low
              and the text long enough, frequencey analysis can still reveal the message. A well known example is the
              <router-link :to="{ name: 'Cipher', params: { cipher: 'Vigenere'}}">Vigenere</router-link> cipher.</li>
            <li><b>Transposition</b> changes the order of the letters in the message. A good example is the
              <router-link :to="{ name: 'Cipher', params: { cipher: 'Railfence'}}">Railfence</router-link> cipher.</li>
          </ul>
          <p>Most substitutions replace one letter with one other, but some ciphers replace each letter with two (or sometimes more) letters. The
          <router-link :to="{ name: 'Cipher', params: { cipher: 'Polybius'}}">Polybius</router-link> cipher replaces each letter with two numbers
          using the so-called Polybius square. The funny <router-link :to="{ name: 'Cipher', params: { cipher: 'Kennycode'}}">Kenny code</router-link>
          replaces each letter with three (m,p and f combinations).</p>
          <p>Things get really complicated if techniques are combined. Combining a simple substitution with a simple transposition makes it
          harder to find the code. The frequencies are still the same, but it will be harder to spot common words.</p>
          <p>A special technique is <b>fractionation</b>. The message first uses substitution where each letter is replaced by two or more.
          The result is transposed, so each substituted code is scattered (or fractionated) through the message. The result is then decoded
          back to letters. A good example is the <router-link :to="{ name: 'Cipher', params: { cipher: 'Bifid'}}">Bifid</router-link>
          cipher, which uses a Polybius square and a columnar transposition.</p>
          <p>For all but the most simple ciphers it takes a lot of effort to find the right solution. First you have to know what cipher
          has been used. Next the keys that were used (at least 1 but sometimes more) have to be found. Look carefully for hints.</p>
        </template>
      </va-item>
      <!-- <va-item v-bind:showitem='show[15]' v-on:toggle='toggleItem(15)'>
        <template v-slot:header>Mathematical puzzles</template>
        <template v-slot:content>
          Work in progress.
        </template>
      </va-item>
      <va-item v-bind:showitem='show[16]' v-on:toggle='toggleItem(16)'>
        <template v-slot:header>Calculating with coordinates</template>
        <template v-slot:content>
          Work in progress.
        </template>
      </va-item> -->
    </div>
  </div>
</template>

<script>

import VaItem from '@/components/inputs/VaItem.vue'

export default {
  name: 'Howto',

  props: {
    msg: String,
    itemnr: Number,
  },

  components: {
    VaItem,
  },

  data: function () {
    return {
      //init section
      show: [],
      numitems: 40,
    }
  },

  // The properties must be set immediately otherwise they are undefined when va-item is created
  created: function() {
    let expanditem;
    if (typeof(this.$route.params.itemnr) != "undefined")
      expanditem = this.$route.params.itemnr;
    else
      expanditem = 0;
    for (let i=0; i < this.numitems; i++) this.show[i] = (i == expanditem);
  },

  methods: {

    collapseAll: function () {
      for (let i=0; i < this.numitems; i++) this.show[i] = false;
    },

    expandAll: function () {
      for (let i=0; i < this.numitems; i++) this.show[i] = true;
    },

    toggleItem: function(itemnr) {
      this.show[itemnr] = !this.show[itemnr];
    }
  },
}

</script>

<style scoped>

li {
  margin-bottom: 2px;
}

p {
  margin-bottom: 5px;
}

ul, ol {
  margin-bottom: 5px;
}

</style>

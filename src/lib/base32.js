var base32converter = (function () {

    // Base32 conversion based on http://www.ietf.org/rfc/rfc3548.txt, http://www.bittorrent.org/beps/bep_0009.html
    // Base32 Alphabet
    var alphabet = 'abcdefghijklmnopqrstuvwxyz234567'

    // Test case
    // input: VZWORUJBA72MT7HK6WIIHGBPL3O7BRIO
    // output: AE6CE8D12107F4C9FCEAF59083982F5EDDF0C50E

    // ZF
    // Z = 25
    // 25 to binary = 11001
    // Add to ouput
    // F = 5
    // 5 to binary = 00101
    // Add to output
    // etc..
    // Then convert each octet to hex

    /**
     * Build lookup table
     *
     * Return an object that maps a character to its
     * byte value.
     */

    var base32lookup = function () {
        var table = {};
        // Invert 'alphabet'
        for (var i = 0; i < alphabet.length; i++) {
            table[alphabet[i]] = i;
        }
        return table;
    }

    return {
        convert: function (input) {

            var output = '';

            for (var i = 0; i < input.length; i++) {
                
                var byteVal = base32lookup()[input[i].toLowerCase()];

                if (byteVal !== undefined) {
                    //if (byteVal < 16) {
                    // Store binary
                    output += byteVal.toString(2);
                    //} else {
                    //    output += 'F' + (byteVal - 15).toString(16);
                    //}
                }
            }

            // Now convert each octet to hex
            var hexOutput = '';
            for (var i = 0; i < output.length; i += 8) {
                hexOutput += parseInt(output.substr(i, 8), 2).toString(16);
            }

            return hexOutput;
        }
    }

}());

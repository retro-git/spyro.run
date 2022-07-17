use wasm_bindgen::prelude::*;
use vcdiff_rs::*;

#[wasm_bindgen]
pub fn patch(orig_file: &[u8], patch_file: &[u8]) -> *const u8 {
   // let patched_file = decode(input, src).unwrap();
    //open_vcdiff_sys::decode(input, src).unwrap()
    //let patched_file = vcdiff::decode(input, src);
    //let mut output = Vec::new();
    //let patched_file = vcdiff_rs::VCDiffDecoder::new(&mut orig_file, &mut output);
    orig_file.as_ptr()
}
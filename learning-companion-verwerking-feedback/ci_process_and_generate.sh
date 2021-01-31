#/bin/bash!
set -e

TESTS=("13ew qsf" "13hi qsf" "13hw qsf" "13wb omr" "14ir omr" "17ia qsf" "17ir qsf" "18ia qsf" "18ir qsf" "19bw qsf_usolveit" "19ew qsf_usolveit" "19fa qsf_usolveit" "19hi qsf_usolveit" "19hw qsf_usolveit" "19ib qsf_usolveit" "19id qsf_usolveit" "19in qsf_usolveit" "19la qsf_usolveit" "19wb qsf_usolveit" "2020_bw_kul qsf_veralg_kul" "2020_fa_kul qsf_veralg_kul" "2020_in_kul qsf_veralg_kul" "2020_la_kul qsf_veralg_kul" "2020_wb_kul qsf_veralg_kul" "2020_ww_kul qsf_veralg_kul" "20bi qsf_usolveit" "20ww qsf_usolveit" "17dw qsf" "18dw qsf")

cd src
for ((i = 0; i < ${#TESTS[@]}; i++)) do
	TEST=(${TESTS[$i]})
	f=${TEST[0]}
	t=${TEST[1]}
	python process.py "../data/$f" $t
	python generateFeedbackData.py "../data/$f"
done

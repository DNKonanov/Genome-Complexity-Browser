python3 changes_model.py -o sin_model --iter 3000 --org_num 100 --orb 10000 --invers_dist sin --insert_dist sin --delete_dist sin --transf_dist sin --inv_prob 0.005
python3 ../start_computing.py -i sin_model --reference org_ref -o sin_out
python3 plot_result.py
